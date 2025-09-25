import { watch, onUnmounted } from 'vue'
import useLatest from '../useLatest'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'
import getDocumentOrShadow from '../utils/getDocumentOrShadow'

type DocumentEventKey = keyof DocumentEventMap

export default function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = 'click',
) {
  const onClickAwayRef = useLatest(onClickAway)
  let cleanup: (() => void) | undefined

  const addListener = () => {
    const handler = (event: any) => {
      const targets = Array.isArray(target) ? target : [target]
      if (
        targets.some((item) => {
          const targetElement = getTargetElement(item)
          return !targetElement || targetElement.contains(event.target)
        })
      ) {
        return
      }
      onClickAwayRef.value(event)
    }

    const documentOrShadow = getDocumentOrShadow(target)
    const eventNames = Array.isArray(eventName) ? eventName : [eventName]

    eventNames.forEach((event) => documentOrShadow.addEventListener(event, handler))

    return () => {
      eventNames.forEach((event) => documentOrShadow.removeEventListener(event, handler))
    }
  }

  const removeListener = () => {
    cleanup?.()
    cleanup = undefined
  }

  // Watch for changes in target and eventName
  watch(
    () => [target, eventName],
    () => {
      removeListener()
      cleanup = addListener()
    },
    { immediate: true, flush: 'post' }
  )

  onUnmounted(() => {
    removeListener()
  })
}
