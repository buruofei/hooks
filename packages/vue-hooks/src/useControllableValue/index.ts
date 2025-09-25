import { ref, computed } from 'vue'
import { isFunction } from '../utils'
import useMemoizedFn from '../useMemoizedFn'
import useUpdate from '../useUpdate'

export interface Options<T> {
  defaultValue?: T
  defaultValuePropName?: string
  valuePropName?: string
  trigger?: string
}

export type Props = Record<string, any>

export interface StandardProps<T> {
  value: T
  defaultValue?: T
  onChange: (val: T) => void
}

function useControllableValue<T = any>(
  props: StandardProps<T>,
): [T, (v: T | ((prev: T) => T)) => void]
function useControllableValue<T = any>(
  props?: Props,
  options?: Options<T>,
): [T, (v: T | ((prev: T) => T), ...args: any[]) => void]
function useControllableValue<T = any>(defaultProps: Props = {}, options: Options<T> = {}) {
  const props = defaultProps

  const {
    defaultValue,
    defaultValuePropName = 'defaultValue',
    valuePropName = 'value',
    trigger = 'onChange',
  } = options

  const value = props[valuePropName] as T
  const isControlled = Object.prototype.hasOwnProperty.call(props, valuePropName)

  const initialValue = computed(() => {
    if (isControlled) {
      return value
    }
    if (Object.prototype.hasOwnProperty.call(props, defaultValuePropName)) {
      return props[defaultValuePropName]
    }
    return defaultValue
  })

  const stateRef = ref(initialValue.value)
  
  if (isControlled) {
    stateRef.value = value
  }

  const update = useUpdate()

  const setState = useMemoizedFn((v: T | ((prev: T) => T), ...args: any[]) => {
    const r = isFunction(v) ? v(stateRef.value) : v

    if (!isControlled) {
      stateRef.value = r
      update()
    }
    if (props[trigger]) {
      props[trigger](r, ...args)
    }
  })

  return [isControlled ? value : stateRef.value, setState] as const
}

export default useControllableValue
