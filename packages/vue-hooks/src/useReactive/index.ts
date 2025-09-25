import { reactive } from 'vue'
import { isObject } from '../utils'

function useReactive<S extends Record<string, any>>(initialState: S): S {
  // Vue 3's reactive system already provides the functionality we need
  // No need for custom proxy implementation like in React
  if (!isObject(initialState)) {
    console.warn('useReactive only works with objects')
    return initialState
  }
  
  return reactive(initialState) as S
}

export default useReactive
