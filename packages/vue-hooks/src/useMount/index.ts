import { onMounted } from 'vue'
import { isFunction } from '../utils'

const useMount = (fn: () => void | (() => void)) => {
  if (process.env.NODE_ENV === 'development') {
    if (!isFunction(fn)) {
      console.error(
        `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`,
      )
    }
  }

  onMounted(() => {
    return fn?.()
  })
}

export default useMount
