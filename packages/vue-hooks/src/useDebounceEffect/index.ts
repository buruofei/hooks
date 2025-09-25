import { ref, watch, type WatchSource, type WatchCallback, type WatchOptions } from 'vue'
import type { DebounceOptions } from '../utils/lodash-polyfill'
import useDebounceFn from '../useDebounceFn'
import useUpdateEffect from '../useUpdateEffect'

function useDebounceEffect<T = any>(
  effect: WatchCallback<T, T | undefined>,
  deps: WatchSource<T> | WatchSource<T>[],
  options?: DebounceOptions,
) {
  const flag = ref({})

  const { run } = useDebounceFn(() => {
    flag.value = {}
  }, options)

  watch(deps as any, () => {
    run()
  })

  useUpdateEffect(effect, flag)
}

export default useDebounceEffect
