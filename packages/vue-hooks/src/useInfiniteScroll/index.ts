import { ref, watch, onUnmounted, nextTick } from 'vue'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'
import useLatest from '../useLatest'
import useMemoizedFn from '../useMemoizedFn'

export interface Options {
  threshold?: number
  rootMargin?: string
  reloadDeps?: any[]
  manual?: boolean
  onBefore?: () => void
}

export interface Result {
  data: any
  loading: boolean
  loadingMore: boolean
  error?: Error
  loadMore: () => void
  loadMoreAsync: () => Promise<any>
  reload: () => void
  reloadAsync: () => Promise<any>
  cancel: () => void
  mutate: (data?: any) => void
  scrollMethod: () => void
}

const useInfiniteScroll = <TData = any>(
  service: (currentData?: TData) => Promise<TData>,
  options: Options & {
    target: BasicTarget
    isNoMore?: (data?: TData) => boolean
  }
): Result => {
  const {
    target,
    isNoMore,
    threshold = 100,
    rootMargin = '0px',
    reloadDeps = [],
    manual,
    onBefore,
  } = options

  const data = ref<TData>()
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<Error>()

  const serviceRef = useLatest(service)
  const isNoMoreRef = useLatest(isNoMore)

  let cleanup: (() => void) | null = null

  const loadData = useMemoizedFn(async (isLoadMore = false) => {
    if (loading.value || loadingMore.value) {
      return
    }

    onBefore?.()

    try {
      if (isLoadMore) {
        loadingMore.value = true
      } else {
        loading.value = true
      }

      const result = await serviceRef.value(isLoadMore ? data.value : undefined)
      
      if (isLoadMore) {
        // Merge data logic should be implemented based on your data structure
        data.value = result
      } else {
        data.value = result
      }
      
      error.value = undefined
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  })

  const loadMore = useMemoizedFn(() => {
    if (isNoMoreRef.value?.(data.value)) {
      return
    }
    loadData(true)
  })

  const loadMoreAsync = useMemoizedFn(() => {
    return loadData(true)
  })

  const reload = useMemoizedFn(() => {
    loadData(false)
  })

  const reloadAsync = useMemoizedFn(() => {
    return loadData(false)
  })

  const cancel = useMemoizedFn(() => {
    loading.value = false
    loadingMore.value = false
  })

  const mutate = useMemoizedFn((newData?: TData) => {
    if (newData !== undefined) {
      data.value = newData
    }
  })

  const scrollMethod = useMemoizedFn(() => {
    const el = getTargetElement(target)
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el as HTMLElement
    if (scrollHeight - scrollTop - clientHeight <= threshold) {
      loadMore()
    }
  })

  const setupScrollListener = () => {
    if (cleanup) {
      cleanup()
    }

    const el = getTargetElement(target)
    if (!el) return

    el.addEventListener('scroll', scrollMethod)

    cleanup = () => {
      el.removeEventListener('scroll', scrollMethod)
    }
  }

  watch(
    () => target,
    () => {
      setupScrollListener()
    },
    { immediate: true, deep: true }
  )

  watch(
    () => reloadDeps,
    () => {
      reload()
    },
    { deep: true }
  )

  // Initial load
  if (!manual) {
    nextTick(() => {
      reload()
    })
  }

  onUnmounted(() => {
    if (cleanup) {
      cleanup()
    }
  })

  return {
    data: data.value,
    loading: loading.value,
    loadingMore: loadingMore.value,
    error: error.value,
    loadMore,
    loadMoreAsync,
    reload,
    reloadAsync,
    cancel,
    mutate,
    scrollMethod,
  }
}

export default useInfiniteScroll
