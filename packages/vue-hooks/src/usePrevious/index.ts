import { ref, watch } from 'vue'

export type ShouldUpdateFunc<T> = (prev?: T, next?: T) => boolean

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b)

function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate,
): T | undefined {
  const prevRef = ref<T | undefined>(undefined)
  const curRef = ref<T | undefined>(undefined)

  watch(() => state, (newState) => {
    if (shouldUpdate(curRef.value, newState)) {
      prevRef.value = curRef.value
      curRef.value = newState
    }
  }, { immediate: true })

  return prevRef.value
}

export default usePrevious
