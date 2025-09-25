import { ref, watch, onUnmounted } from 'vue'
import useLatest from '../useLatest'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

type EventType = MouseEvent | TouchEvent

export interface Options {
  delay?: number
  moveThreshold?: { x?: number; y?: number }
  onClick?: (event: EventType) => void
  onLongPressEnd?: (event: EventType) => void
}

function useLongPress(
  onLongPress: (event: EventType) => void,
  target: BasicTarget,
  { delay = 300, moveThreshold, onClick, onLongPressEnd }: Options = {},
) {
  const onLongPressRef = useLatest(onLongPress)
  const onClickRef = useLatest(onClick)
  const onLongPressEndRef = useLatest(onLongPressEnd)

  const timerRef = ref<ReturnType<typeof setTimeout>>()
  const isTriggeredRef = ref(false)
  const pervPositionRef = ref({ x: 0, y: 0 })
  const mousePressed = ref(false)
  const touchPressed = ref(false)
  
  const hasMoveThreshold = !!(
    (moveThreshold?.x && moveThreshold.x > 0) ||
    (moveThreshold?.y && moveThreshold.y > 0)
  )

  let cleanup: (() => void) | undefined

  function getClientPosition(event: EventType) {
    if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      }
    }
    if (event instanceof MouseEvent) {
      return {
        clientX: event.clientX,
        clientY: event.clientY,
      }
    }
    return { clientX: 0, clientY: 0 }
  }

  const overThreshold = (event: EventType) => {
    const { clientX, clientY } = getClientPosition(event)
    const offsetX = Math.abs(clientX - pervPositionRef.value.x)
    const offsetY = Math.abs(clientY - pervPositionRef.value.y)

    return !!(
      (moveThreshold?.x && offsetX > moveThreshold.x) ||
      (moveThreshold?.y && offsetY > moveThreshold.y)
    )
  }

  const createTimer = (event: EventType) => {
    timerRef.value = setTimeout(() => {
      onLongPressRef.value(event)
      isTriggeredRef.value = true
    }, delay)
  }

  const onTouchStart = (event: TouchEvent) => {
    if (touchPressed.value) {
      return
    }
    touchPressed.value = true

    if (hasMoveThreshold) {
      const { clientX, clientY } = getClientPosition(event)
      pervPositionRef.value.x = clientX
      pervPositionRef.value.y = clientY
    }
    createTimer(event)
  }

  const onMouseDown = (event: MouseEvent) => {
    if ((event as any)?.sourceCapabilities?.firesTouchEvents) {
      return
    }

    mousePressed.value = true

    if (hasMoveThreshold) {
      pervPositionRef.value.x = event.clientX
      pervPositionRef.value.y = event.clientY
    }
    createTimer(event)
  }

  const onMove = (event: EventType) => {
    if (timerRef.value && overThreshold(event)) {
      clearTimeout(timerRef.value)
      timerRef.value = undefined
    }
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (!touchPressed.value) {
      return
    }
    touchPressed.value = false

    if (timerRef.value) {
      clearTimeout(timerRef.value)
      timerRef.value = undefined
    }

    if (isTriggeredRef.value) {
      onLongPressEndRef.value?.(event)
    } else if (onClickRef.value) {
      onClickRef.value(event)
    }
    isTriggeredRef.value = false
  }

  const onMouseUp = (event: MouseEvent) => {
    if ((event as any)?.sourceCapabilities?.firesTouchEvents) {
      return
    }
    if (!mousePressed.value) {
      return
    }
    mousePressed.value = false

    if (timerRef.value) {
      clearTimeout(timerRef.value)
      timerRef.value = undefined
    }

    if (isTriggeredRef.value) {
      onLongPressEndRef.value?.(event)
    } else if (onClickRef.value) {
      onClickRef.value(event)
    }
    isTriggeredRef.value = false
  }

  const onMouseLeave = (event: MouseEvent) => {
    if (!mousePressed.value) {
      return
    }
    mousePressed.value = false

    if (timerRef.value) {
      clearTimeout(timerRef.value)
      timerRef.value = undefined
    }
    if (isTriggeredRef.value) {
      onLongPressEndRef.value?.(event)
      isTriggeredRef.value = false
    }
  }

  const setupListeners = () => {
    cleanup?.()
    
    const targetElement = getTargetElement(target)
    if (!targetElement?.addEventListener) {
      return
    }

    targetElement.addEventListener('mousedown', onMouseDown)
    targetElement.addEventListener('mouseup', onMouseUp)
    targetElement.addEventListener('mouseleave', onMouseLeave)
    targetElement.addEventListener('touchstart', onTouchStart)
    targetElement.addEventListener('touchend', onTouchEnd)

    if (hasMoveThreshold) {
      targetElement.addEventListener('mousemove', onMove)
      targetElement.addEventListener('touchmove', onMove)
    }

    cleanup = () => {
      if (timerRef.value) {
        clearTimeout(timerRef.value)
        isTriggeredRef.value = false
      }

      targetElement.removeEventListener('mousedown', onMouseDown)
      targetElement.removeEventListener('mouseup', onMouseUp)
      targetElement.removeEventListener('mouseleave', onMouseLeave)
      targetElement.removeEventListener('touchstart', onTouchStart)
      targetElement.removeEventListener('touchend', onTouchEnd)

      if (hasMoveThreshold) {
        targetElement.removeEventListener('mousemove', onMove)
        targetElement.removeEventListener('touchmove', onMove)
      }
    }
  }

  watch(() => target, setupListeners, { immediate: true, flush: 'post' })

  onUnmounted(() => {
    cleanup?.()
  })
}

export default useLongPress
