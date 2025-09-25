import { ref, type Ref } from 'vue'

function useLatest<T>(value: T): Ref<T> {
  const latest = ref(value) as Ref<T>
  latest.value = value
  return latest
}

export default useLatest
