import { ref, computed, type Ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import { isFunction, isString, isObject } from '../utils'

export interface Options<T> {
  defaultSelected?: T[]
  itemKey?: string | ((item: T) => string | number)
}

function useSelections<T>(items: T[], options?: T[] | Options<T>) {
  let defaultSelected: T[] = []
  let itemKey: Options<T>['itemKey']

  if (Array.isArray(options)) {
    defaultSelected = options
  } else if (isObject(options)) {
    defaultSelected = options?.defaultSelected ?? defaultSelected
    itemKey = options?.itemKey ?? itemKey
  }

  const getKey = (item: T): string | number => {
    if (isFunction(itemKey)) {
      return itemKey(item)
    }
    if (isString(itemKey) && isObject(item)) {
      return (item as any)[itemKey]
    }

    return item as string | number
  }

  const selected = ref<T[]>(defaultSelected)

  const selectedMap = computed(() => {
    const keyToItemMap = new Map<string | number, T>()

    if (!Array.isArray(selected.value)) {
      return keyToItemMap
    }

    selected.value.forEach((item) => {
      keyToItemMap.set(getKey(item as any), item as any)
    })

    return keyToItemMap
  })

  const isSelected = useMemoizedFn((item: T) => selectedMap.value.has(getKey(item)))

  const select = useMemoizedFn((item: T) => {
    const newMap = new Map(selectedMap.value)
    newMap.set(getKey(item), item)
    selected.value = Array.from(newMap.values()) as any
  })

  const unSelect = useMemoizedFn((item: T) => {
    const newMap = new Map(selectedMap.value)
    newMap.delete(getKey(item))
    selected.value = Array.from(newMap.values())
  })

  const toggle = useMemoizedFn((item: T) => {
    if (isSelected(item)) {
      unSelect(item)
    } else {
      select(item)
    }
  })

  const selectAll = useMemoizedFn(() => {
    const newMap = new Map(selectedMap.value)
    items.forEach((item) => {
      newMap.set(getKey(item), item)
    })
    selected.value = Array.from(newMap.values())
  })

  const unSelectAll = useMemoizedFn(() => {
    const newMap = new Map(selectedMap.value)
    items.forEach((item) => {
      newMap.delete(getKey(item))
    })
    selected.value = Array.from(newMap.values())
  })

  const noneSelected = computed<boolean>(() => 
    items.every((item) => !selectedMap.value.has(getKey(item)))
  )

  const allSelected = computed<boolean>(() => 
    items.every((item) => selectedMap.value.has(getKey(item))) && !noneSelected.value
  )

  const partiallySelected = computed<boolean>(() => 
    !noneSelected.value && !allSelected.value
  )

  const toggleAll = useMemoizedFn(() => (allSelected.value ? unSelectAll() : selectAll()))

  const clearAll = useMemoizedFn(() => {
    selected.value = []
  })

  const setSelected = (newSelected: T[]) => {
    selected.value = newSelected
  }

  return {
    selected,
    noneSelected,
    allSelected,
    partiallySelected,
    setSelected: useMemoizedFn(setSelected),
    isSelected,
    select,
    unSelect,
    toggle,
    selectAll,
    unSelectAll,
    clearAll,
    toggleAll,
  } as const
}

export default useSelections
