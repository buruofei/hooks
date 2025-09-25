import Cookies from 'js-cookie'
import { ref, type Ref } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import { isFunction, isString } from '../utils'

export type State = string | undefined

export interface Options extends Cookies.CookieAttributes {
  defaultValue?: State | (() => State)
}

function useCookieState(cookieKey: string, options: Options = {}): [Ref<State>, (newValue: State | ((prevState: State) => State), newOptions?: Cookies.CookieAttributes) => void] {
  const state = ref<State>((() => {
    const cookieValue = Cookies.get(cookieKey)

    if (isString(cookieValue)) {
      return cookieValue
    }

    if (isFunction(options.defaultValue)) {
      return options.defaultValue()
    }

    return options.defaultValue
  })())

  const updateState = useMemoizedFn(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {},
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { defaultValue, ...restOptions } = { ...options, ...newOptions }
      const value = isFunction(newValue) ? newValue(state.value) : newValue

      state.value = value

      if (value === undefined) {
        Cookies.remove(cookieKey)
      } else {
        Cookies.set(cookieKey, value, restOptions)
      }
    },
  )

  return [state, updateState]
}

export default useCookieState
