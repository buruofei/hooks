import { ref, computed, type Ref } from 'vue'

export interface Actions<T> {
  setLeft: () => void
  setRight: () => void
  set: (value: T) => void
  toggle: () => void
}

function useToggle<T = boolean>(): [Ref<boolean>, Actions<T>]

function useToggle<T>(defaultValue: T): [Ref<T>, Actions<T>]

function useToggle<T, U>(defaultValue: T, reverseValue: U): [Ref<T | U>, Actions<T | U>]

function useToggle<D, R>(defaultValue: D = false as unknown as D, reverseValue?: R) {
  const state = ref<D | R>(defaultValue)

  const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R

  const toggle = () => {
    state.value = state.value === defaultValue ? reverseValueOrigin : defaultValue
  }

  const set = (value: D | R) => {
    state.value = value
  }

  const setLeft = () => {
    state.value = defaultValue
  }

  const setRight = () => {
    state.value = reverseValueOrigin
  }

  const actions = {
    toggle,
    set,
    setLeft,
    setRight,
  }

  return [state as Ref<D | R>, actions]
}

export default useToggle
