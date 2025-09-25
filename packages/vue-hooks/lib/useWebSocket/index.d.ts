import { type Ref } from 'vue';
export declare enum ReadyState {
    Connecting = 0,
    Open = 1,
    Closing = 2,
    Closed = 3
}
export interface Options {
    reconnectLimit?: number;
    reconnectInterval?: number;
    manual?: boolean;
    onOpen?: (event: WebSocketEventMap['open'], instance: WebSocket) => void;
    onClose?: (event: WebSocketEventMap['close'], instance: WebSocket) => void;
    onMessage?: (message: WebSocketEventMap['message'], instance: WebSocket) => void;
    onError?: (event: WebSocketEventMap['error'], instance: WebSocket) => void;
    protocols?: string | string[];
}
export interface Result {
    latestMessage?: Ref<WebSocketEventMap['message'] | undefined>;
    sendMessage: WebSocket['send'];
    disconnect: () => void;
    connect: () => void;
    readyState: Ref<ReadyState>;
    webSocketIns?: Ref<WebSocket | undefined>;
}
declare function useWebSocket(socketUrl: string, options?: Options): Result;
export default useWebSocket;
