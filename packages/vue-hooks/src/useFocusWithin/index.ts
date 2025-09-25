import { ref, watch, onUnmounted } from 'vue'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

export interface Options {
  onFocus?: (e: FocusEvent) => void
  onBlur?: (e: FocusEvent) => void
  onChange?: (isFocusWithin: boolean) => void
}

function useFocusWithin(target: BasicTarget, options?: Options) {
  const isFocusWithin = ref(false)

  let cleanup: (() => void) | null = null

  const setup = () => {
    if (cleanup) {
      cleanup()
    }

    const el = getTargetElement(target)
    if (!el) return

    const onFocusIn = (e: FocusEvent) => {
      if (!isFocusWithin.value) {
        isFocusWithin.value = true
        options?.onFocus?.(e)
        options?.onChange?.(true)
      }
    }

    const onFocusOut = (e: FocusEvent) => {
      // Check if the new focus target is still within the element
      if (
        isFocusWithin.value &&
        (!e.relatedTarget || !el.contains(e.relatedTarget as Node))
      ) {
        isFocusWithin.value = false
        options?.onBlur?.(e)
        options?.onChange?.(false)
      }
    }

    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)

    cleanup = () => {
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
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

  return isFocusWithin
}

export default useFocusWithin
