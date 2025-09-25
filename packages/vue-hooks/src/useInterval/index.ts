import { ref, watch, onUnmounted } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import { isNumber } from '../utils'

const useInterval = (fn: () => void, delay?: number, options: { immediate?: boolean } = {}) => {
  const timerCallback = useMemoizedFn(fn)
  const timerRef = ref<ReturnType<typeof setInterval> | null>(null)

  const clear = () => {
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }
  }

  watch(() => [delay, options.immediate], ([newDelay, immediate]) => {
    clear()
    
    if (!isNumber(newDelay) || newDelay < 0) {
      return
    }
    
    if (immediate) {
      timerCallback()
    }
    
    timerRef.value = setInterval(timerCallback, newDelay)
  }, { immediate: true })

  onUnmounted(() => {
    clear()
  })

  return clear
}

export default useInterval
