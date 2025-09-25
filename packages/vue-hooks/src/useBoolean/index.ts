import { computed, type Ref } from 'vue'
import useToggle from '../useToggle'

export interface Actions {
  setTrue: () => void
  setFalse: () => void
  set: (value: boolean) => void
  toggle: () => void
}

export default function useBoolean(defaultValue = false): [Ref<boolean>, Actions] {
  const [state, { toggle, set }] = useToggle(!!defaultValue)

  const actions: Actions = {
    toggle,
    set: (v) => set(!!v),
    setTrue: () => set(true),
    setFalse: () => set(false),
  }

  return [state, actions]
}
