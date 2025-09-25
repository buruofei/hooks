import { ref, watch, type Ref } from 'vue'
import useEventListener from '../useEventListener'
import { isFunction, isUndef } from '../utils'

export const SYNC_STORAGE_EVENT_NAME = 'VUE_HOOKS_SYNC_STORAGE_EVENT_NAME'

export type SetState<S> = S | ((prevState?: S) => S)

export interface Options<T> {
  defaultValue?: T | (() => T)
  listenStorageChange?: boolean
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  onError?: (error: unknown) => void
}

export function createUseStorageState(getStorage: () => Storage | undefined) {
  function useStorageState<T>(key: string, options: Options<T> = {}): [Ref<T | undefined>, (value: SetState<T>) => void] {
    let storage: Storage | undefined
    const {
      listenStorageChange = false,
      onError = (e) => {
        console.error(e)
      },
    } = options

    // https://github.com/alibaba/hooks/issues/800
    try {
      storage = getStorage()
    } catch (err) {
      onError(err)
    }

    const serializer = (value: T) => {
      if (options.serializer) {
        return options.serializer(value)
      }
      return JSON.stringify(value)
    }

    const deserializer = (value: string) => {
      if (options.deserializer) {
        return options.deserializer(value)
      }
      return JSON.parse(value)
    }

    function getStoredValue() {
      try {
        const raw = storage?.getItem(key)
        if (raw) {
          return deserializer(raw)
        }
      } catch (e) {
        onError(e)
      }
      if (isFunction(options.defaultValue)) {
        return options.defaultValue()
      }
      return options.defaultValue
    }

    const state = ref<T | undefined>(getStoredValue()) as Ref<T | undefined>

    // Watch for key changes
    watch(() => key, () => {
      state.value = getStoredValue()
    })

    const updateState = (value: SetState<T>) => {
      const currentState = isFunction(value) ? value(state.value) : value

      if (!listenStorageChange) {
        state.value = currentState
      }

      try {
        let newValue: string | null
        const oldValue = storage?.getItem(key)

        if (isUndef(currentState)) {
          newValue = null
          storage?.removeItem(key)
        } else {
          newValue = serializer(currentState)
          storage?.setItem(key, newValue)
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            // send custom event to communicate within same page
            // importantly this should not be a StorageEvent since those cannot
            // be constructed with a non-built-in storage area
            new CustomEvent(SYNC_STORAGE_EVENT_NAME, {
              detail: {
                key,
                newValue,
                oldValue,
                storageArea: storage,
              },
            }),
          )
        }
      } catch (e) {
        onError(e)
      }
    }

    const syncState = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== storage) {
        return
      }
      state.value = getStoredValue()
    }

    const syncStateFromCustomEvent = (event: CustomEvent<StorageEvent>) => {
      syncState(event.detail)
    }

    // from another document
    useEventListener('storage', syncState, {
      enable: listenStorageChange,
    })

    // from the same document but different hooks
    useEventListener(SYNC_STORAGE_EVENT_NAME, syncStateFromCustomEvent, {
      enable: listenStorageChange,
    })

    return [state, updateState]
  }

  return useStorageState
}
