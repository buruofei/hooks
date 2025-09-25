import { ref, type Ref } from 'vue'
import { isFunction } from '../utils'
import useMemoizedFn from '../useMemoizedFn'
import useCreation from '../useCreation'

type ResetState = () => void

const useResetState = <S>(
  initialState: S | (() => S),
): [Ref<S>, (value: S | ((prev: S) => S)) => void, ResetState] => {
  const initialStateRef = ref(initialState)
  const initialStateMemo = useCreation(
    () =>
      isFunction(initialStateRef.value) ? (initialStateRef.value as () => S)() : initialStateRef.value,
    [],
  )

  const state = ref(initialStateMemo) as Ref<S>

  const setState = (value: S | ((prev: S) => S)) => {
    if (isFunction(value)) {
      state.value = value(state.value)
    } else {
      state.value = value
    }
  }

  const resetState = useMemoizedFn(() => {
    state.value = initialStateMemo
  })

  return [state, setState, resetState]
}

export default useResetState
