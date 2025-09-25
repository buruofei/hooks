import { onMounted, watch, type WatchSource, type WatchCallback, type WatchOptions } from 'vue'
import isBrowser from '../utils/isBrowser'

// In Vue 3, there's no direct equivalent to useLayoutEffect
// We use onMounted for server-side compatibility and watch for reactivity
const useIsomorphicLayoutEffect = <T = any>(
  effect: WatchCallback<T, T | undefined>,
  deps?: WatchSource<T> | WatchSource<T>[],
  options?: WatchOptions
) => {
  if (isBrowser) {
    // Use immediate watch in browser
    if (deps) {
      watch(deps as any, effect, { ...options, immediate: true })
    } else {
      onMounted(() => {
        effect(undefined as any, undefined, () => {})
      })
    }
  } else {
    // On server, just run on mount
    onMounted(() => {
      if (deps) {
        watch(deps as any, effect, options)
      } else {
        effect(undefined as any, undefined, () => {})
      }
    })
  }
}

export default useIsomorphicLayoutEffect
