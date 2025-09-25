import { computed, ref } from 'vue'
import { isFunction } from '../utils'

type noop = (this: any, ...args: any[]) => any

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>

const useMemoizedFn = <T extends noop>(fn: T): PickFunction<T> => {
  if (process.env.NODE_ENV === 'development') {
    if (!isFunction(fn)) {
      console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`)
    }
  }

  const fnRef = ref<T>(fn)
  fnRef.value = fn

  const memoizedFn = ref<PickFunction<T>>()

  if (!memoizedFn.value) {
    memoizedFn.value = function (this, ...args) {
      return fnRef.value.apply(this, args)
    } as PickFunction<T>
  }

  return memoizedFn.value
}

export default useMemoizedFn
