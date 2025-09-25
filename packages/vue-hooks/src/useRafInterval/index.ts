import { ref, watch, onUnmounted } from 'vue'
import useLatest from '../useLatest'
import { isNumber } from '../utils'

interface Handle {
  id: ReturnType<typeof setInterval> | ReturnType<typeof requestAnimationFrame>
}

const setRafInterval = (callback: () => void, delay: number = 0): Handle => {
  if (typeof requestAnimationFrame === 'undefined') {
    return {
      id: setInterval(callback, delay),
    }
  }
  let start = Date.now()
  const handle: Handle = {
    id: 0,
  }
  const loop = () => {
    const current = Date.now()
    if (current - start >= delay) {
      callback()
      start = Date.now()
    }
    handle.id = requestAnimationFrame(loop)
  }
  handle.id = requestAnimationFrame(loop)
  return handle
}

const cancelAnimationFrameIsNotDefined = (t: any): t is ReturnType<typeof setTimeout> => {
  return typeof cancelAnimationFrame === 'undefined'
}

const clearRafInterval = (handle: Handle) => {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearInterval(handle.id)
  }
  cancelAnimationFrame(handle.id)
}

function useRafInterval(
  fn: () => void,
  delay: number | undefined,
  options?: {
    immediate?: boolean
  },
) {
  const immediate = options?.immediate

  const fnRef = useLatest(fn)
  const timerRef = ref<Handle>()

  const clear = () => {
    if (timerRef.value) {
      clearRafInterval(timerRef.value)
      timerRef.value = undefined
    }
  }

  watch(() => delay, (newDelay) => {
    clear()
    
    if (!isNumber(newDelay) || newDelay < 0) {
      return
    }
    
    if (immediate) {
      fnRef.value()
    }
    
    timerRef.value = setRafInterval(() => {
      fnRef.value()
    }, newDelay)
  }, { immediate: true })

  onUnmounted(() => {
    clear()
  })

  return clear
}

export default useRafInterval
