import { watch, onUnmounted, ref } from 'vue'
import isBrowser from '../utils/isBrowser'

export interface Options {
  restoreOnUnmount?: boolean
}

const DEFAULT_OPTIONS: Options = {
  restoreOnUnmount: false,
}

function useTitle(title: string, options: Options = DEFAULT_OPTIONS) {
  const originalTitle = ref(isBrowser ? document.title : '')

  watch(() => title, (newTitle) => {
    if (isBrowser) {
      document.title = newTitle
    }
  }, { immediate: true })

  onUnmounted(() => {
    if (options.restoreOnUnmount && isBrowser) {
      document.title = originalTitle.value
    }
  })
}

export default useTitle
