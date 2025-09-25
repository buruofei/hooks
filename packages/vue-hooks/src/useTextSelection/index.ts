import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'
import useLatest from '../useLatest'

interface Rect {
  top: number
  left: number
  bottom: number
  right: number
  height: number
  width: number
}

export interface State extends Rect {
  text: string
}

const initRect: Rect = {
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  height: NaN,
  width: NaN,
}

const initState: State = {
  text: '',
  ...initRect,
}

function getRectFromSelection(selection: Selection | null): Rect {
  if (!selection) {
    return initRect
  }

  if (selection.rangeCount < 1) {
    return initRect
  }
  const range = selection.getRangeAt(0)
  const { height, width, top, left, right, bottom } = range.getBoundingClientRect()
  return {
    height,
    width,
    top,
    left,
    right,
    bottom,
  }
}

function useTextSelection(target?: BasicTarget<Document | Element>): typeof state {
  const state = ref<State>(initState)
  const stateRef = useLatest(state)
  const isInRangeRef = ref(false)

  let mouseupHandler: ((e: MouseEvent) => void) | null = null
  let mousedownHandler: ((e: MouseEvent) => void) | null = null

  const setup = () => {
    const el = getTargetElement(target, document)
    if (!el) {
      return
    }

    mouseupHandler = () => {
      let selObj: Selection | null = null
      let text = ''
      let rect = initRect
      if (!window.getSelection) {
        return
      }
      selObj = window.getSelection()
      text = selObj ? selObj.toString() : ''
      if (text && isInRangeRef.value) {
        rect = getRectFromSelection(selObj)
        state.value = { ...stateRef.value, text, ...rect }
      }
    }

    mousedownHandler = (e: MouseEvent) => {
      // 如果是鼠标右键需要跳过 这样选中的数据就不会被清空
      if (e.button === 2) {
        return
      }
      if (!window.getSelection) {
        return
      }
      if (stateRef.value.text) {
        state.value = { ...initState }
      }
      isInRangeRef.value = false
      const selObj = window.getSelection()
      if (!selObj) {
        return
      }
      selObj.removeAllRanges()
      isInRangeRef.value = el.contains(e.target as Node)
    }

    el.addEventListener('mouseup', mouseupHandler)
    document.addEventListener('mousedown', mousedownHandler)
  }

  const cleanup = () => {
    const el = getTargetElement(target, document)
    if (el && mouseupHandler) {
      el.removeEventListener('mouseup', mouseupHandler)
    }
    if (mousedownHandler) {
      document.removeEventListener('mousedown', mousedownHandler)
    }
  }

  watch(
    () => target,
    () => {
      cleanup()
      setup()
    },
    { immediate: true, deep: true }
  )

  onUnmounted(() => {
    cleanup()
  })

  return state
}

export default useTextSelection
