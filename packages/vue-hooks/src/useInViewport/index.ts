import { ref, watch, onUnmounted, type Ref } from 'vue'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

type CallbackType = (entry: IntersectionObserverEntry) => void

export interface Options {
  rootMargin?: string
  threshold?: number | number[]
  root?: BasicTarget<Element>
  callback?: CallbackType
}

function useInViewport(target: BasicTarget | BasicTarget[], options?: Options): [Ref<boolean | undefined>, Ref<number | undefined>] {
  const { callback, ...option } = options || {}

  const state = ref<boolean | undefined>()
  const ratio = ref<number | undefined>()

  let observer: IntersectionObserver | null = null

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const setupObserver = () => {
    cleanup()

    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    const targets = Array.isArray(target) ? target : [target]
    const els = targets.map((element) => getTargetElement(element)).filter(Boolean) as Element[]

    if (!els.length) {
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratio.value = entry.intersectionRatio
          state.value = entry.isIntersecting
          callback?.(entry)
        }
      },
      {
        ...option,
        root: getTargetElement(options?.root),
      },
    )

    els.forEach((el) => observer!.observe(el))
  }

  watch(() => [target, options?.rootMargin, options?.threshold], setupObserver, { 
    immediate: true, 
    flush: 'post',
    deep: true 
  })

  onUnmounted(() => {
    cleanup()
  })

  return [state, ratio]
}

export default useInViewport
