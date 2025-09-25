import { ref, type Ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import { isFunction } from '../utils'

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void

const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S),
): [Ref<S>, SetState<S>] => {
  const state = ref<S>(isFunction(initialState) ? initialState() : initialState) as Ref<S>

  const setMergeState = useMemoizedFn((patch) => {
    const newState = isFunction(patch) ? patch(state.value) : patch
    if (newState) {
      state.value = { ...state.value, ...newState } as S
    }
  })

  return [state, setMergeState]
}

export default useSetState
