import { watch, type WatchSource, type WatchCallback, type WatchOptions } from 'vue'
import { isEqual } from 'lodash'

// Deep compare layout effect using lodash isEqual
function useDeepCompareLayoutEffect<T = any>(
  effect: WatchCallback<T, T | undefined>,
  deps: WatchSource<T> | WatchSource<T>[],
  options?: WatchOptions
) {
  let prevDeps: any
  
  watch(
    deps as any,
    (newDeps: any, oldDeps: any, onCleanup: any) => {
      // Use deep comparison instead of reference comparison
      if (!isEqual(prevDeps, newDeps)) {
        prevDeps = JSON.parse(JSON.stringify(newDeps)) // Deep clone
        return effect(newDeps, oldDeps, onCleanup)
      }
    },
    { ...options, flush: 'post' } // Use 'post' flush for layout effect timing
  )
}

export default useDeepCompareLayoutEffect
