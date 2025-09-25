import { onUnmounted } from 'vue'
import { debounce, type DebounceOptions } from '../utils/lodash-polyfill'
import useLatest from '../useLatest'
import { isFunction } from '../utils'

type noop = (...args: any[]) => any

function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
  if (process.env.NODE_ENV === 'development') {
    if (!isFunction(fn)) {
      console.error(`useDebounceFn expected parameter is a function, got ${typeof fn}`)
    }
  }

  const fnRef = useLatest(fn)
  const wait = options?.wait ?? 1000

  const debounced = debounce(
    (...args: Parameters<T>): ReturnType<T> => {
      return fnRef.value(...args)
    },
    wait,
    options,
  )

  onUnmounted(() => {
    debounced.cancel()
  })

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  }
}

export default useDebounceFn
