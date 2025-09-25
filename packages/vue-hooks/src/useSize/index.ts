import { watch, onUnmounted, type Ref } from 'vue'
import useRafState from '../useRafState'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

type Size = { width: number; height: number }

function useSize(target: BasicTarget): Ref<Size | undefined> {
  const [state, setState] = useRafState<Size | undefined>(() => {
    const el = getTargetElement(target)
    return el ? { width: el.clientWidth, height: el.clientHeight } : undefined
  })

  let resizeObserver: ResizeObserver | null = null

  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  const observe = () => {
    cleanup()
    
    const el = getTargetElement(target)
    if (!el) {
      setState(undefined)
      return
    }

    // Initialize state
    setState({ width: el.clientWidth, height: el.clientHeight })

    // Use ResizeObserver if available, otherwise fallback to window resize
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { clientWidth, clientHeight } = entry.target as HTMLElement
          setState({ width: clientWidth, height: clientHeight })
        })
      })
      resizeObserver.observe(el)
    }
  }

  watch(() => target, observe, { immediate: true, flush: 'post' })

  onUnmounted(() => {
    cleanup()
  })

  return state
}

export default useSize
