import { ref, onUnmounted } from 'vue'
import useLatest from '../useLatest'

type Subscription<T> = (val: T) => void

export class EventEmitter<T> {
  private subscriptions = new Set<Subscription<T>>()

  emit = (val: T) => {
    this.subscriptions.forEach(subscription => {
      subscription(val)
    })
  }

  useSubscription = (callback: Subscription<T>) => {
    const callbackRef = useLatest(callback)

    const subscription = (val: T) => {
      callbackRef.value(val)
    }

    this.subscriptions.add(subscription)

    onUnmounted(() => {
      this.subscriptions.delete(subscription)
    })
  }
}

function useEventEmitter<T = void>() {
  const emitterRef = ref<EventEmitter<T>>()
  
  if (!emitterRef.value) {
    emitterRef.value = new EventEmitter<T>()
  }
  
  return emitterRef.value
}

export default useEventEmitter
