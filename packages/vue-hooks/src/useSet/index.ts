import { ref, type Ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'

function useSet<K>(initialValue?: Iterable<K>) {
  const getInitValue = () => new Set(initialValue)
  const set = ref(getInitValue())

  const updateSet = (updater: (set: Set<K>) => Set<K>) => {
    set.value = updater(new Set(set.value as any)) as any
  }

  const add = useMemoizedFn((key: K) => {
    if ((set.value as any).has(key)) {
      return
    }
    updateSet((newSet) => {
      newSet.add(key)
      return newSet
    })
  })

  const remove = useMemoizedFn((key: K) => {
    if (!(set.value as any).has(key)) {
      return
    }
    updateSet((newSet) => {
      newSet.delete(key)
      return newSet
    })
  })

  const reset = useMemoizedFn(() => {
    set.value = getInitValue()
  })

  return [
    set,
    {
      add,
      remove,
      reset,
    },
  ]
}

export default useSet
