import { ref, watch, onUnmounted } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import { isNumber } from '../utils'

const useTimeout = (fn: () => void, delay?: number) => {
  const timerCallback = useMemoizedFn(fn)
  const timerRef = ref<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => {
    if (timerRef.value) {
      clearTimeout(timerRef.value)
      timerRef.value = null
    }
  }

  watch(() => delay, (newDelay) => {
    clear()
    
    if (!isNumber(newDelay) || newDelay < 0) {
      return
    }
    
    timerRef.value = setTimeout(timerCallback, newDelay)
  }, { immediate: true })

  onUnmounted(() => {
    clear()
  })

  return clear
}

export default useTimeout
