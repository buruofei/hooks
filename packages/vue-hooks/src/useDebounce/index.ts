import { ref, watch, type Ref } from 'vue'
import useDebounceFn from '../useDebounceFn'
import type { DebounceOptions } from '../utils/lodash-polyfill'

function useDebounce<T>(value: T, options?: DebounceOptions): Ref<T> {
  const debounced = ref(value) as Ref<T>

  const { run } = useDebounceFn(() => {
    debounced.value = value
  }, options)

  watch(() => value, () => {
    run()
  }, { immediate: true })

  return debounced
}

export default useDebounce
