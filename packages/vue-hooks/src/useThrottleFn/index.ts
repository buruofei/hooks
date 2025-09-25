import { onUnmounted } from 'vue'
import { throttle, type ThrottleOptions } from '../utils/lodash-polyfill'
import useLatest from '../useLatest'
import { isFunction } from '../utils'

type noop = (...args: any[]) => any

function useThrottleFn<T extends noop>(fn: T, options?: ThrottleOptions) {
  if (process.env.NODE_ENV === 'development') {
    if (!isFunction(fn)) {
      console.error(`useThrottleFn expected parameter is a function, got ${typeof fn}`)
    }
  }

  const fnRef = useLatest(fn)
  const wait = options?.wait ?? 1000

  const throttled = throttle(
    (...args: Parameters<T>): ReturnType<T> => {
      return fnRef.value(...args)
    },
    wait,
    options,
  )

  onUnmounted(() => {
    throttled.cancel()
  })

  return {
    run: throttled,
    cancel: throttled.cancel,
    flush: throttled.flush,
  }
}

export default useThrottleFn
