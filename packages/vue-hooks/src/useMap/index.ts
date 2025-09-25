import { ref, type Ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'

function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {
  const getInitValue = () => new Map(initialValue)
  const map = ref(getInitValue())

  const set = useMemoizedFn((key: K, entry: T) => {
    const temp = new Map(map.value as any)
    temp.set(key, entry)
    map.value = temp as any
  })

  const setAll = useMemoizedFn((newMap: Iterable<readonly [K, T]>) => {
    map.value = new Map(newMap)
  })

  const remove = useMemoizedFn((key: K) => {
    const temp = new Map(map.value)
    temp.delete(key)
    map.value = temp
  })

  const reset = useMemoizedFn(() => {
    map.value = getInitValue()
  })

  const get = useMemoizedFn((key: K) => map.value.get(key))

  return [
    map,
    {
      set,
      setAll,
      remove,
      reset,
      get,
    },
  ]
}

export default useMap
