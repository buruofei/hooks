import { ref } from 'vue'
import depsAreSame from '../utils/depsAreSame'

const useCreation = <T>(factory: () => T, deps: any[]) => {
  const current = ref({
    deps,
    obj: undefined as T,
    initialized: false,
  })
  
  if (current.value.initialized === false || !depsAreSame(current.value.deps, deps)) {
    current.value.deps = deps
    current.value.obj = factory() as any
    current.value.initialized = true
  }
  
  return current.value.obj
}

export default useCreation
