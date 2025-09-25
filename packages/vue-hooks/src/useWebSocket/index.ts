import { ref, watch, onUnmounted, type Ref } from 'vue'
import useLatest from '../useLatest'
import useMemoizedFn from '../useMemoizedFn'

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface Options {
  reconnectLimit?: number
  reconnectInterval?: number
  manual?: boolean
  onOpen?: (event: WebSocketEventMap['open'], instance: WebSocket) => void
  onClose?: (event: WebSocketEventMap['close'], instance: WebSocket) => void
  onMessage?: (message: WebSocketEventMap['message'], instance: WebSocket) => void
  onError?: (event: WebSocketEventMap['error'], instance: WebSocket) => void
  protocols?: string | string[]
}

export interface Result {
  latestMessage?: Ref<WebSocketEventMap['message'] | undefined>
  sendMessage: WebSocket['send']
  disconnect: () => void
  connect: () => void
  readyState: Ref<ReadyState>
  webSocketIns?: Ref<WebSocket | undefined>
}

function useWebSocket(socketUrl: string, options: Options = {}): Result {
  const {
    reconnectLimit = 3,
    reconnectInterval = 3 * 1000,
    manual = false,
    onOpen,
    onClose,
    onMessage,
    onError,
    protocols,
  } = options

  const latestMessage = ref<WebSocketEventMap['message']>()
  const readyState = ref<ReadyState>(ReadyState.Closed)

  const onOpenRef = useLatest(onOpen)
  const onCloseRef = useLatest(onClose)
  const onMessageRef = useLatest(onMessage)
  const onErrorRef = useLatest(onError)
  const readyStateRef = useLatest(readyState)

  const reconnectTimesRef = ref(0)
  const reconnectTimerRef = ref<ReturnType<typeof setTimeout>>()
  const websocketRef = ref<WebSocket>()

  const reconnect = () => {
    if (
      reconnectTimesRef.value < reconnectLimit &&
      websocketRef.value?.readyState !== ReadyState.Open
    ) {
      if (reconnectTimerRef.value) {
        clearTimeout(reconnectTimerRef.value)
      }

      reconnectTimerRef.value = setTimeout(() => {
        connectWs()
        reconnectTimesRef.value++
      }, reconnectInterval)
    }
  }

  const connectWs = () => {
    if (reconnectTimerRef.value) {
      clearTimeout(reconnectTimerRef.value)
    }

    if (websocketRef.value) {
      websocketRef.value.close()
    }

    const ws = new WebSocket(socketUrl, protocols)
    readyState.value = ReadyState.Connecting

    ws.onerror = (event) => {
      if (websocketRef.value !== ws) {
        return
      }
      reconnect()
      onErrorRef.value?.(event, ws)
      readyState.value = ws.readyState || ReadyState.Closed
    }

    ws.onopen = (event) => {
      if (websocketRef.value !== ws) {
        return
      }
      onOpenRef.value?.(event, ws)
      reconnectTimesRef.value = 0
      readyState.value = ws.readyState || ReadyState.Open
    }

    ws.onmessage = (message: WebSocketEventMap['message']) => {
      if (websocketRef.value !== ws) {
        return
      }
      onMessageRef.value?.(message, ws)
      latestMessage.value = message
    }

    ws.onclose = (event) => {
      onCloseRef.value?.(event, ws)
      // closed by server
      if (websocketRef.value === ws) {
        reconnect()
      }
      // closed by disconnect or closed by server
      if (!websocketRef.value || websocketRef.value === ws) {
        readyState.value = ws.readyState || ReadyState.Closed
      }
    }

    websocketRef.value = ws
  }

  const sendMessage: WebSocket['send'] = useMemoizedFn((message) => {
    if (readyStateRef.value.value === ReadyState.Open) {
      websocketRef.value?.send(message)
    } else {
      throw new Error('WebSocket disconnected')
    }
  })

  const connect = useMemoizedFn(() => {
    reconnectTimesRef.value = 0
    connectWs()
  })

  const disconnect = useMemoizedFn(() => {
    if (reconnectTimerRef.value) {
      clearTimeout(reconnectTimerRef.value)
    }

    reconnectTimesRef.value = reconnectLimit
    websocketRef.value?.close()
    websocketRef.value = undefined
  })

  watch(
    () => [socketUrl, manual],
    ([newSocketUrl, newManual]) => {
      if (!newManual && newSocketUrl) {
        connect()
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    disconnect()
  })

  return {
    latestMessage,
    sendMessage,
    connect,
    disconnect,
    readyState,
    webSocketIns: websocketRef,
  }
}

export default useWebSocket
