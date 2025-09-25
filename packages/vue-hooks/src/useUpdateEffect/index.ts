import { watch, onMounted, type WatchSource, type WatchCallback, type WatchOptions } from 'vue'

function useUpdateEffect<T = any>(
  effect: WatchCallback<T, T | undefined>,
  deps: WatchSource<T> | WatchSource<T>[],
  options?: WatchOptions
) {
  let isMounted = false

  onMounted(() => {
    isMounted = true
  })

  watch(
    deps as any,
    (newVal: any, oldVal: any, onCleanup: any) => {
      if (!isMounted) {
        return
      }
      return effect(newVal, oldVal, onCleanup)
    },
    options
  )
}

export default useUpdateEffect
