import { ref, watch, type WatchSource, type WatchCallback } from 'vue'
import type { ThrottleOptions } from '../utils/lodash-polyfill'
import useThrottleFn from '../useThrottleFn'
import useUpdateEffect from '../useUpdateEffect'

function useThrottleEffect<T = any>(
  effect: WatchCallback<T, T | undefined>,
  deps: WatchSource<T> | WatchSource<T>[],
  options?: ThrottleOptions,
) {
  const flag = ref({})

  const { run } = useThrottleFn(() => {
    flag.value = {}
  }, options)

  watch(deps as any, () => {
    run()
  })

  useUpdateEffect(effect, flag)
}

export default useThrottleEffect
