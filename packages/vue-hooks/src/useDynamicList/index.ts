import { ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'

const useDynamicList = <T>(initialList: T[] = []) => {
  const counterRef = ref(-1)
  const keyList = ref<number[]>([])

  const setKey = (index: number) => {
    counterRef.value += 1
    keyList.value.splice(index, 0, counterRef.value)
  }

  const list = ref<T[]>([])

  // Initialize
  initialList.forEach((_, index) => {
    setKey(index)
  })
  list.value = [...initialList]

  const resetList = useMemoizedFn((newList: T[]) => {
    keyList.value = []
    counterRef.value = -1
    newList.forEach((_, index) => {
      setKey(index)
    })
    list.value = [...newList]
  })

  const insert = useMemoizedFn((index: number, item: T) => {
    const temp = [...list.value]
    temp.splice(index, 0, item as any)
    setKey(index)
    list.value = temp
  })

  const getKey = useMemoizedFn((index: number) => keyList.value[index])

  const getIndex = useMemoizedFn((key: number) => keyList.value.findIndex((ele) => ele === key))

  const merge = useMemoizedFn((index: number, items: T[]) => {
    const temp = [...list.value]
    items.forEach((_, i) => {
      setKey(index + i)
    })
    temp.splice(index, 0, ...(items as any))
    list.value = temp
  })

  const replace = useMemoizedFn((index: number, item: T) => {
    const temp = [...list.value]
    temp[index] = item as any
    list.value = temp
  })

  const remove = useMemoizedFn((index: number) => {
    const temp = [...list.value]
    temp.splice(index, 1)

    // remove keys if necessary
    try {
      keyList.value.splice(index, 1)
    } catch (e) {
      console.error(e)
    }
    list.value = temp
  })

  const batchRemove = useMemoizedFn((indexes: number[]) => {
    if (!Array.isArray(indexes)) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `\`indexes\` parameter of \`batchRemove\` function expected to be an array, but got "${typeof indexes}".`,
        )
      }
      return
    }
    if (!indexes.length) {
      return
    }

    const newKeyList: number[] = []
    const newList = list.value.filter((item, index) => {
      const shouldKeep = !indexes.includes(index)

      if (shouldKeep) {
        newKeyList.push(getKey(index))
      }

      return shouldKeep
    })

    keyList.value = newKeyList
    list.value = newList
  })

  const move = useMemoizedFn((oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) {
      return
    }
    
    const newList = [...list.value]
    const temp = newList.filter((_, index: number) => index !== oldIndex)
    temp.splice(newIndex, 0, newList[oldIndex])

    // move keys if necessary
    try {
      const keyTemp = keyList.value.filter((_, index: number) => index !== oldIndex)
      keyTemp.splice(newIndex, 0, keyList.value[oldIndex])
      keyList.value = keyTemp
    } catch (e) {
      console.error(e)
    }

    list.value = temp
  })

  const push = useMemoizedFn((item: T) => {
    setKey(list.value.length)
    list.value = list.value.concat([item as any])
  })

  const pop = useMemoizedFn(() => {
    // remove keys if necessary
    try {
      keyList.value = keyList.value.slice(0, keyList.value.length - 1)
    } catch (e) {
      console.error(e)
    }

    list.value = list.value.slice(0, list.value.length - 1)
  })

  const unshift = useMemoizedFn((item: T) => {
    setKey(0)
    list.value = [item as any].concat(list.value as any)
  })

  const shift = useMemoizedFn(() => {
    // remove keys if necessary
    try {
      keyList.value = keyList.value.slice(1, keyList.value.length)
    } catch (e) {
      console.error(e)
    }
    list.value = list.value.slice(1, list.value.length)
  })

  const sortList = useMemoizedFn((result: T[]) =>
    result
      .map((item, index) => ({ key: index, item })) // add index into obj
      .sort((a, b) => getIndex(a.key) - getIndex(b.key)) // sort based on the index of table
      .filter((item) => !!item.item) // remove undefined(s)
      .map((item) => item.item), // retrive the data
  )

  return {
    list,
    insert,
    merge,
    replace,
    remove,
    batchRemove,
    getKey,
    getIndex,
    move,
    push,
    pop,
    unshift,
    shift,
    sortList,
    resetList,
  }
}

export default useDynamicList
