import { ref } from 'vue'
import useLatest from '../useLatest'
import useMemoizedFn from '../useMemoizedFn'
import { isFunction } from '../utils'

interface EventTarget<U> {
  target: {
    value: U
  }
}

export interface Options<T, U> {
  initialValue?: T
  transformer?: (value: U) => T
}

function useEventTarget<T, U = T>(options?: Options<T, U>) {
  const { initialValue, transformer } = options || {}
  const value = ref<T | undefined>(initialValue)

  const transformerRef = useLatest(transformer)

  const reset = useMemoizedFn(() => {
    value.value = initialValue
  })

  const onChange = useMemoizedFn((e: EventTarget<U>) => {
    const _value = e.target.value
    if (isFunction(transformerRef.value)) {
      value.value = transformerRef.value(_value)
    } else {
      // no transformer => U and T should be the same
      value.value = _value as unknown as T
    }
  })

  return [
    value,
    {
      onChange,
      reset,
    },
  ] as const
}

export default useEventTarget
