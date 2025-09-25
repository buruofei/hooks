import { ref, computed, watch, onUnmounted, type Ref, type CSSProperties } from 'vue'
import useEventListener from '../useEventListener'
import useLatest from '../useLatest'
import useMemoizedFn from '../useMemoizedFn'
import useSize from '../useSize'
import { getTargetElement } from '../utils/domTarget'
import type { BasicTarget } from '../utils/domTarget'
import { isNumber } from '../utils'

type ItemHeight<T> = (index: number, data: T) => number

export interface Options<T> {
  containerTarget: BasicTarget
  wrapperTarget: BasicTarget
  itemHeight: number | ItemHeight<T>
  overscan?: number
}

const useVirtualList = <T = any>(list: T[], options: Options<T>) => {
  const { containerTarget, wrapperTarget, itemHeight, overscan = 5 } = options

  const itemHeightRef = useLatest(itemHeight)
  const size = useSize(containerTarget)
  const scrollTriggerByScrollToFunc = ref(false)

  const targetList = ref<{ index: number; data: T }[]>([])
  const wrapperStyle = ref<CSSProperties>({})

  const getVisibleCount = (containerHeight: number, fromIndex: number) => {
    if (isNumber(itemHeightRef.value)) {
      return Math.ceil(containerHeight / itemHeightRef.value)
    }

    let sum = 0
    let endIndex = 0
    for (let i = fromIndex; i < list.length; i++) {
      const height = (itemHeightRef.value as ItemHeight<T>)(i, list[i])
      sum += height
      endIndex = i
      if (sum >= containerHeight) {
        break
      }
    }
    return endIndex - fromIndex
  }

  const getOffset = (scrollTop: number) => {
    if (isNumber(itemHeightRef.value)) {
      return Math.floor(scrollTop / itemHeightRef.value)
    }
    let sum = 0
    let offset = 0
    for (let i = 0; i < list.length; i++) {
      const height = (itemHeightRef.value as ItemHeight<T>)(i, list[i])
      sum += height
      if (sum >= scrollTop) {
        offset = i
        break
      }
    }
    return offset + 1
  }

  // 获取上部高度
  const getDistanceTop = (index: number) => {
    if (isNumber(itemHeightRef.value)) {
      const height = index * itemHeightRef.value
      return height
    }
    const height = list
      .slice(0, index)
      .reduce<number>((sum, _, i) => sum + (itemHeightRef.value as ItemHeight<T>)(i, list[i]), 0)
    return height
  }

  const totalHeight = computed(() => {
    if (isNumber(itemHeightRef.value)) {
      return list.length * itemHeightRef.value
    }
    return list.reduce<number>(
      (sum, _, index) => sum + (itemHeightRef.value as ItemHeight<T>)(index, list[index]),
      0,
    )
  })

  const calculateRange = () => {
    const container = getTargetElement(containerTarget)

    if (container) {
      const { scrollTop, clientHeight } = container as HTMLElement

      const offset = getOffset(scrollTop)
      const visibleCount = getVisibleCount(clientHeight, offset)

      const start = Math.max(0, offset - overscan)
      const end = Math.min(list.length, offset + visibleCount + overscan)

      const offsetTop = getDistanceTop(start)

      wrapperStyle.value = {
        height: totalHeight.value - offsetTop + 'px',
        marginTop: offsetTop + 'px',
      }

      targetList.value = list.slice(start, end).map((ele, index) => ({
        data: ele,
        index: index + start,
      }))
    }
  }

  // Apply wrapper style when it changes
  watch(() => wrapperStyle.value, (newStyle) => {
    const wrapper = getTargetElement(wrapperTarget) as HTMLElement
    if (wrapper) {
      Object.keys(newStyle).forEach((key) => {
        wrapper.style[key as any] = newStyle[key as keyof CSSProperties] as string
      })
    }
  }, { deep: true })

  // Recalculate when size or list changes
  watch(() => [size.value?.width, size.value?.height, list], () => {
    if (!size.value?.width || !size.value?.height) {
      return
    }
    calculateRange()
  }, { deep: true })

  useEventListener(
    'scroll',
    (e) => {
      if (scrollTriggerByScrollToFunc.value) {
        scrollTriggerByScrollToFunc.value = false
        return
      }
      e.preventDefault()
      calculateRange()
    },
    {
      target: containerTarget,
    },
  )

  const scrollTo = useMemoizedFn((index: number) => {
    const container = getTargetElement(containerTarget) as HTMLElement
    if (container) {
      scrollTriggerByScrollToFunc.value = true
      container.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  })

  return [targetList, scrollTo] as const
}

export default useVirtualList
