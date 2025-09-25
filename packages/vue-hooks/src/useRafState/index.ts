import { ref, onUnmounted, type Ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'

function useRafState<S>(initialState: S | (() => S)): [Ref<S>, (value: S | ((prevState: S) => S)) => void] {
  const rafRef = ref(0)
  const state = ref(typeof initialState === 'function' ? (initialState as () => S)() : initialState) as Ref<S>
  
  const setRafState = useMemoizedFn((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(rafRef.value)
    
    rafRef.value = requestAnimationFrame(() => {
      state.value = typeof value === 'function' ? (value as (prevState: S) => S)(state.value) : value
    })
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafRef.value)
  })

  return [state, setRafState]
}

export default useRafState
