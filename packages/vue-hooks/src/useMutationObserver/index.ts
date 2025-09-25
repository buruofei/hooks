import { watch, onUnmounted } from 'vue'
import { getTargetElement } from '../utils/domTarget'
import type { BasicTarget } from '../utils/domTarget'
import useLatest from '../useLatest'

// Note: useDeepCompareEffectWithTarget is complex, we'll use a simpler approach
const useMutationObserver = (
  callback: MutationCallback,
  target: BasicTarget,
  options: MutationObserverInit = {},
): void => {
  const callbackRef = useLatest(callback)
  let observer: MutationObserver | null = null

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const setup = () => {
    cleanup()
    const element = getTargetElement(target)
    if (!element) {
      return
    }
    observer = new MutationObserver(callbackRef.value)
    observer.observe(element, options)
  }

  watch(
    () => target,
    () => {
      setup()
    },
    { immediate: true, deep: true }
  )

  watch(
    () => options,
    () => {
      setup()
    },
    { deep: true }
  )

  onUnmounted(() => {
    cleanup()
  })
}

export default useMutationObserver
