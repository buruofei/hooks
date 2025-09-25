import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { isObject } from '../utils'

export interface NetworkState {
  since?: Date
  online?: boolean
  rtt?: number
  type?: string
  downlink?: number
  saveData?: boolean
  downlinkMax?: number
  effectiveType?: string
}

enum NetworkEventType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CHANGE = 'change',
}

function getConnection() {
  if (typeof navigator === 'undefined') return null
  
  const nav = navigator as any
  if (!isObject(nav)) {
    return null
  }
  return (nav as any).connection || (nav as any).mozConnection || (nav as any).webkitConnection
}

function getConnectionProperty(): NetworkState {
  const c = getConnection()
  if (!c) {
    return {}
  }
  return {
    rtt: c.rtt,
    type: c.type,
    saveData: c.saveData,
    downlink: c.downlink,
    downlinkMax: c.downlinkMax,
    effectiveType: c.effectiveType,
  }
}

function useNetwork(): Ref<NetworkState> {
  const state = ref<NetworkState>({
    since: undefined,
    online: typeof navigator !== 'undefined' ? navigator?.onLine : undefined,
    ...getConnectionProperty(),
  })

  let connection: any = null

  const onOnline = () => {
    state.value = {
      ...state.value,
      online: true,
      since: new Date(),
    }
  }

  const onOffline = () => {
    state.value = {
      ...state.value,
      online: false,
      since: new Date(),
    }
  }

  const onConnectionChange = () => {
    state.value = {
      ...state.value,
      ...getConnectionProperty(),
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    window.addEventListener(NetworkEventType.ONLINE, onOnline)
    window.addEventListener(NetworkEventType.OFFLINE, onOffline)

    connection = getConnection()
    connection?.addEventListener(NetworkEventType.CHANGE, onConnectionChange)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return

    window.removeEventListener(NetworkEventType.ONLINE, onOnline)
    window.removeEventListener(NetworkEventType.OFFLINE, onOffline)
    connection?.removeEventListener(NetworkEventType.CHANGE, onConnectionChange)
  })

  return state
}

export default useNetwork
