import { ref, type Ref } from 'vue'
import useUnmountedRef from '../useUnmountedRef'
import { isFunction } from '../utils'

function useSafeState<S>(initialState: S | (() => S)): [Ref<S>, (currentState: S | ((prev: S) => S)) => void]
function useSafeState<S = undefined>(): [Ref<S | undefined>, (currentState: S | ((prev: S | undefined) => S | undefined)) => void]

function useSafeState<S>(initialState?: S | (() => S)) {
  const unmountedRef = useUnmountedRef()
  const state = ref(isFunction(initialState) ? initialState() : initialState) as Ref<S>
  
  const setCurrentState = (currentState: S | ((prev: S) => S)) => {
    /** if component is unmounted, stop update */
    if (unmountedRef.value) {
      return
    }
    
    if (isFunction(currentState)) {
      state.value = currentState(state.value)
    } else {
      state.value = currentState
    }
  }

  return [state, setCurrentState] as const
}

export default useSafeState
