import { ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'

function useLockFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
  const lockRef = ref(false)

  return useMemoizedFn(async (...args: P) => {
    if (lockRef.value) {
      return
    }
    lockRef.value = true
    try {
      const ret = await fn(...args)
      return ret
    } catch (e) {
      throw e
    } finally {
      lockRef.value = false
    }
  })
}

export default useLockFn
