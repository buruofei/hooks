import { ref, watch, type Ref } from 'vue'
import useThrottleFn from '../useThrottleFn'
import type { ThrottleOptions } from '../utils/lodash-polyfill'

function useThrottle<T>(value: T, options?: ThrottleOptions): Ref<T> {
  const throttled = ref(value) as Ref<T>

  const { run } = useThrottleFn(() => {
    throttled.value = value
  }, options)

  watch(() => value, () => {
    run()
  }, { immediate: true })

  return throttled
}

export default useThrottle
