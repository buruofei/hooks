import { ref, watch, onUnmounted } from 'vue'
import useLatest from '../useLatest'
import { isNumber } from '../utils'

interface Handle {
  id: ReturnType<typeof setTimeout> | ReturnType<typeof requestAnimationFrame>
}

const setRafTimeout = (callback: () => void, delay: number = 0): Handle => {
  if (typeof requestAnimationFrame === 'undefined') {
    return {
      id: setTimeout(callback, delay),
    }
  }

  const handle: Handle = {
    id: 0,
  }

  const startTime = Date.now()

  const loop = () => {
    const current = Date.now()
    if (current - startTime >= delay) {
      callback()
    } else {
      handle.id = requestAnimationFrame(loop)
    }
  }
  handle.id = requestAnimationFrame(loop)
  return handle
}

const cancelAnimationFrameIsNotDefined = (t: any): t is ReturnType<typeof setTimeout> => {
  return typeof cancelAnimationFrame === 'undefined'
}

const clearRafTimeout = (handle: Handle) => {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearTimeout(handle.id)
  }
  cancelAnimationFrame(handle.id)
}

function useRafTimeout(fn: () => void, delay: number | undefined) {
  const fnRef = useLatest(fn)
  const timerRef = ref<Handle>()

  const clear = () => {
    if (timerRef.value) {
      clearRafTimeout(timerRef.value)
      timerRef.value = undefined
    }
  }

  watch(() => delay, (newDelay) => {
    clear()
    
    if (!isNumber(newDelay) || newDelay < 0) {
      return
    }
    
    timerRef.value = setRafTimeout(() => {
      fnRef.value()
    }, newDelay)
  }, { immediate: true })

  onUnmounted(() => {
    clear()
  })

  return clear
}

export default useRafTimeout
