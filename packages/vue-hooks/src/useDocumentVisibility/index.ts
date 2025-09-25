import { ref, type Ref } from 'vue'
import useEventListener from '../useEventListener'
import isBrowser from '../utils/isBrowser'

type VisibilityState = 'hidden' | 'visible' | 'prerender' | undefined

const getVisibility = (): VisibilityState => {
  if (!isBrowser) {
    return 'visible'
  }
  return document.visibilityState
}

function useDocumentVisibility(): Ref<VisibilityState> {
  const documentVisibility = ref<VisibilityState>(getVisibility())

  useEventListener(
    'visibilitychange',
    () => {
      documentVisibility.value = getVisibility()
    },
    {
      target: () => document,
    },
  )

  return documentVisibility
}

export default useDocumentVisibility
