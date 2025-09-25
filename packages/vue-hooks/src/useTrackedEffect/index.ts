import { ref, watch, type WatchSource } from 'vue'

type Effect<T extends any[]> = (
  changes?: number[],
  previousDeps?: T,
  currentDeps?: T,
) => void | (() => void)

const diffTwoDeps = (deps1?: any[], deps2?: any[]) => {
  // Let's do a reference equality check on 2 dependency list.
  // If deps1 is defined, we iterate over deps1 and do comparison on each element with equivalent element from deps2
  // As this func is used only in this hook, we assume 2 deps always have same length.
  return deps1
    ? deps1
        .map((_, idx) => (!Object.is(deps1[idx], deps2?.[idx]) ? idx : -1))
        .filter((ele) => ele >= 0)
    : deps2
      ? deps2.map((_, idx) => idx)
      : []
}

const useTrackedEffect = <T extends any[]>(
  effect: Effect<T>, 
  deps?: WatchSource<T[number]>[]
) => {
  const previousDepsRef = ref<T>()

  watch(
    deps || [],
    (newDeps) => {
      const changes = diffTwoDeps(previousDepsRef.value, newDeps as any)
      const previousDeps = previousDepsRef.value
      previousDepsRef.value = newDeps as any
      return effect(changes, previousDeps, newDeps as any)
    }
  )
}

export default useTrackedEffect
