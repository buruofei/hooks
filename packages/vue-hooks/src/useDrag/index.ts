import { ref, watch, onMounted, onUnmounted } from 'vue'
import useLatest from '../useLatest'
import useMount from '../useMount'
import { isString } from '../utils'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

export interface Options {
  onDragStart?: (event: DragEvent) => void
  onDragEnd?: (event: DragEvent) => void
  dragImage?: {
    image: string | Element
    offsetX?: number
    offsetY?: number
  }
}

const useDrag = <T>(data: T, target: BasicTarget, options: Options = {}) => {
  const optionsRef = useLatest(options)
  const dataRef = useLatest(data)
  const imageElementRef = ref<Element>()

  const { dragImage } = optionsRef.value

  useMount(() => {
    if (dragImage?.image) {
      const { image } = dragImage

      if (isString(image)) {
        const imageElement = new Image()
        imageElement.src = image
        imageElementRef.value = imageElement
      } else {
        imageElementRef.value = image
      }
    }
  })

  let cleanup: (() => void) | null = null

  const setup = () => {
    if (cleanup) {
      cleanup()
    }

    const targetElement = getTargetElement(target)
    if (!targetElement?.addEventListener) {
      return
    }

    const onDragStart = (event: DragEvent) => {
      optionsRef.value.onDragStart?.(event)
      event.dataTransfer?.setData('custom', JSON.stringify(dataRef.value))

      if (dragImage?.image && imageElementRef.value) {
        const { offsetX = 0, offsetY = 0 } = dragImage
        event.dataTransfer?.setDragImage(imageElementRef.value, offsetX, offsetY)
      }
    }

    const onDragEnd = (event: DragEvent) => {
      optionsRef.value.onDragEnd?.(event)
    }

    targetElement.setAttribute('draggable', 'true')
    targetElement.addEventListener('dragstart', onDragStart)
    targetElement.addEventListener('dragend', onDragEnd)

    cleanup = () => {
      targetElement.removeEventListener('dragstart', onDragStart)
      targetElement.removeEventListener('dragend', onDragEnd)
    }
  }

  watch(
    () => target,
    () => {
      setup()
    },
    { immediate: true, deep: true }
  )

  onUnmounted(() => {
    if (cleanup) {
      cleanup()
    }
  })
}

export default useDrag
