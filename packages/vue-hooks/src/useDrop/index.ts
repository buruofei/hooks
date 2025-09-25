import { ref, watch, onUnmounted } from 'vue'
import useLatest from '../useLatest'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

export interface Options {
  onFiles?: (files: File[], event?: DragEvent) => void
  onUri?: (url: string, event?: DragEvent) => void
  onDom?: (content: any, event?: DragEvent) => void
  onText?: (text: string, event?: ClipboardEvent) => void
  onDragEnter?: (event?: DragEvent) => void
  onDragOver?: (event?: DragEvent) => void
  onDragLeave?: (event?: DragEvent) => void
  onDrop?: (event?: DragEvent) => void
  onPaste?: (event?: ClipboardEvent) => void
}

const useDrop = (target: BasicTarget, options: Options = {}) => {
  const optionsRef = useLatest(options)

  // https://stackoverflow.com/a/26459269
  const dragEnterTarget = ref<EventTarget>()

  let cleanup: (() => void) | null = null

  const setup = () => {
    if (cleanup) {
      cleanup()
    }

    const targetElement = getTargetElement(target)
    if (!targetElement?.addEventListener) {
      return
    }

    const onData = (
      dataTransfer: DataTransfer,
      event: DragEvent | ClipboardEvent,
    ) => {
      const uri = dataTransfer.getData('text/uri-list')
      const dom = dataTransfer.getData('custom')

      if (dom && optionsRef.value.onDom) {
        let data = dom
        try {
          data = JSON.parse(dom)
        } catch {
          data = dom
        }
        optionsRef.value.onDom(data, event as DragEvent)
        return
      }

      if (uri && optionsRef.value.onUri) {
        optionsRef.value.onUri(uri, event as DragEvent)
        return
      }

      if (dataTransfer.files && dataTransfer.files.length && optionsRef.value.onFiles) {
        optionsRef.value.onFiles(Array.from(dataTransfer.files), event as DragEvent)
        return
      }

      if (dataTransfer.items && dataTransfer.items.length && optionsRef.value.onText) {
        dataTransfer.items[0].getAsString((text) => {
          optionsRef.value.onText!(text, event as ClipboardEvent)
        })
      }
    }

    const onDragEnter = (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      dragEnterTarget.value = event.target as EventTarget
      optionsRef.value.onDragEnter?.(event)
    }

    const onDragOver = (event: DragEvent) => {
      event.preventDefault()
      optionsRef.value.onDragOver?.(event)
    }

    const onDragLeave = (event: DragEvent) => {
      if (event.target === dragEnterTarget.value) {
        optionsRef.value.onDragLeave?.(event)
      }
    }

    const onDrop = (event: DragEvent) => {
      event.preventDefault()
      if (event.dataTransfer) {
        onData(event.dataTransfer, event)
      }
      optionsRef.value.onDrop?.(event)
    }

    const onPaste = (event: ClipboardEvent) => {
      if (event.clipboardData) {
        onData(event.clipboardData, event)
      }
      optionsRef.value.onPaste?.(event)
    }

    targetElement.addEventListener('dragenter', onDragEnter)
    targetElement.addEventListener('dragover', onDragOver)
    targetElement.addEventListener('dragleave', onDragLeave)
    targetElement.addEventListener('drop', onDrop)
    targetElement.addEventListener('paste', onPaste)

    cleanup = () => {
      targetElement.removeEventListener('dragenter', onDragEnter)
      targetElement.removeEventListener('dragover', onDragOver)
      targetElement.removeEventListener('dragleave', onDragLeave)
      targetElement.removeEventListener('drop', onDrop)
      targetElement.removeEventListener('paste', onPaste)
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

export default useDrop
