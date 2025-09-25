import { ref, watch, onUnmounted, nextTick } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import useLatest from '../useLatest'

export interface Options<TData, TParams extends any[]> {
  manual?: boolean
  defaultParams?: TParams
  refreshDeps?: any[]
  refreshDepsAction?: () => void
  loadingDelay?: number
  pollingInterval?: number
  pollingWhenHidden?: boolean
  pollingErrorRetryCount?: number
  debounceWait?: number
  debounceLeading?: boolean
  debounceTrailing?: boolean
  debounceMaxWait?: number
  throttleWait?: number
  throttleLeading?: boolean
  throttleTrailing?: boolean
  cacheKey?: string
  cacheTime?: number
  staleTime?: number
  retryCount?: number
  retryInterval?: number
  onBefore?: (params: TParams) => void
  onSuccess?: (data: TData, params: TParams) => void
  onError?: (e: Error, params: TParams) => void
  onFinally?: (params: TParams, data?: TData, e?: Error) => void
  formatResult?: (res: any) => TData
  ready?: boolean
}

export interface Result<TData, TParams extends any[]> {
  data: any
  error: any
  loading: any
  params: any
  run: (...params: TParams) => void
  runAsync: (...params: TParams) => Promise<TData>
  refresh: () => void
  refreshAsync: () => Promise<TData>
  mutate: (data?: TData | ((oldData?: TData) => TData)) => void
  cancel: () => void
}

function useRequest<TData = any, TParams extends any[] = any[]>(
  service: (...args: TParams) => Promise<TData>,
  options: Options<TData, TParams> = {}
): Result<TData, TParams> {
  const {
    manual = false,
    defaultParams = [] as unknown as TParams,
    refreshDeps = [],
    refreshDepsAction,
    onBefore,
    onSuccess,
    onError,
    onFinally,
    formatResult,
    ready = true,
  } = options

  const data = ref<TData>()
  const error = ref<Error>()
  const loading = ref(false)
  const params = ref<TParams>(defaultParams)

  const serviceRef = useLatest(service)

  let requestIdRef = 0

  const execute = useMemoizedFn(async (...args: TParams): Promise<TData> => {
    if (!ready) {
      throw new Error('Request is not ready')
    }

    const currentRequestId = ++requestIdRef
    
    params.value = args
    loading.value = true
    error.value = undefined

    onBefore?.(args)

    try {
      const result = await serviceRef.value(...args)
      
      // Check if this is still the latest request
      if (currentRequestId === requestIdRef) {
        const formattedResult = formatResult ? formatResult(result) : result
        data.value = formattedResult
        onSuccess?.(formattedResult, args)
        return formattedResult
      }
      return result
    } catch (e) {
      if (currentRequestId === requestIdRef) {
        const errorObj = e as Error
        error.value = errorObj
        onError?.(errorObj, args)
        throw errorObj
      }
      throw e
    } finally {
      if (currentRequestId === requestIdRef) {
        loading.value = false
        onFinally?.(args, data.value, error.value)
      }
    }
  })

  const run = useMemoizedFn((...args: TParams) => {
    execute(...args).catch(() => {
      // Error already handled in execute
    })
  })

  const runAsync = useMemoizedFn((...args: TParams) => {
    return execute(...args)
  })

  const refresh = useMemoizedFn(() => {
    run(...params.value)
  })

  const refreshAsync = useMemoizedFn(() => {
    return runAsync(...params.value)
  })

  const mutate = useMemoizedFn((newData?: TData | ((oldData?: TData) => TData)) => {
    if (typeof newData === 'function') {
      data.value = (newData as (oldData?: TData) => TData)(data.value)
    } else {
      data.value = newData
    }
  })

  const cancel = useMemoizedFn(() => {
    requestIdRef++
    loading.value = false
  })

  // Watch refresh dependencies
  watch(
    () => refreshDeps,
    () => {
      if (refreshDepsAction) {
        refreshDepsAction()
      } else if (!manual) {
        refresh()
      }
    },
    { deep: true }
  )

  // Initial execution
  if (!manual) {
    nextTick(() => {
      run(...params.value)
    })
  }

  onUnmounted(() => {
    cancel()
  })

  return {
    data,
    error,
    loading,
    params,
    run,
    runAsync,
    refresh,
    refreshAsync,
    mutate,
    cancel,
  }
}

export default useRequest
