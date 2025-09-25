import { ref, type Ref } from 'vue'
import useLatest from '../useLatest'
import useMemoizedFn from '../useMemoizedFn'
import { isFunction } from '../utils'

type GetStateAction<S> = () => S

function useGetState<S>(
  initialState: S | (() => S),
): [Ref<S>, (value: S | ((prev: S) => S)) => void, GetStateAction<S>]
function useGetState<S = undefined>(): [
  Ref<S | undefined>,
  (value: S | ((prev: S | undefined) => S | undefined)) => void,
  GetStateAction<S | undefined>,
]
function useGetState<S>(initialState?: S | (() => S)) {
  const state = ref(isFunction(initialState) ? initialState() : initialState) as Ref<S>
  const stateRef = useLatest(state)

  const setState = (value: S | ((prev: S) => S)) => {
    if (isFunction(value)) {
      state.value = value(state.value)
    } else {
      state.value = value
    }
  }

  const getState = useMemoizedFn(() => stateRef.value.value)

  return [state, setState, getState]
}

export default useGetState
