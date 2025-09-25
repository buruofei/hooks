"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyState = void 0;
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
var ReadyState;
(function (ReadyState) {
    ReadyState[ReadyState["Connecting"] = 0] = "Connecting";
    ReadyState[ReadyState["Open"] = 1] = "Open";
    ReadyState[ReadyState["Closing"] = 2] = "Closing";
    ReadyState[ReadyState["Closed"] = 3] = "Closed";
})(ReadyState || (exports.ReadyState = ReadyState = {}));
function useWebSocket(socketUrl, options = {}) {
    const { reconnectLimit = 3, reconnectInterval = 3 * 1000, manual = false, onOpen, onClose, onMessage, onError, protocols, } = options;
    const latestMessage = (0, vue_1.ref)();
    const readyState = (0, vue_1.ref)(ReadyState.Closed);
    const onOpenRef = (0, useLatest_1.default)(onOpen);
    const onCloseRef = (0, useLatest_1.default)(onClose);
    const onMessageRef = (0, useLatest_1.default)(onMessage);
    const onErrorRef = (0, useLatest_1.default)(onError);
    const readyStateRef = (0, useLatest_1.default)(readyState);
    const reconnectTimesRef = (0, vue_1.ref)(0);
    const reconnectTimerRef = (0, vue_1.ref)();
    const websocketRef = (0, vue_1.ref)();
    const reconnect = () => {
        if (reconnectTimesRef.value < reconnectLimit &&
            websocketRef.value?.readyState !== ReadyState.Open) {
            if (reconnectTimerRef.value) {
                clearTimeout(reconnectTimerRef.value);
            }
            reconnectTimerRef.value = setTimeout(() => {
                connectWs();
                reconnectTimesRef.value++;
            }, reconnectInterval);
        }
    };
    const connectWs = () => {
        if (reconnectTimerRef.value) {
            clearTimeout(reconnectTimerRef.value);
        }
        if (websocketRef.value) {
            websocketRef.value.close();
        }
        const ws = new WebSocket(socketUrl, protocols);
        readyState.value = ReadyState.Connecting;
        ws.onerror = (event) => {
            if (websocketRef.value !== ws) {
                return;
            }
            reconnect();
            onErrorRef.value?.(event, ws);
            readyState.value = ws.readyState || ReadyState.Closed;
        };
        ws.onopen = (event) => {
            if (websocketRef.value !== ws) {
                return;
            }
            onOpenRef.value?.(event, ws);
            reconnectTimesRef.value = 0;
            readyState.value = ws.readyState || ReadyState.Open;
        };
        ws.onmessage = (message) => {
            if (websocketRef.value !== ws) {
                return;
            }
            onMessageRef.value?.(message, ws);
            latestMessage.value = message;
        };
        ws.onclose = (event) => {
            onCloseRef.value?.(event, ws);
            // closed by server
            if (websocketRef.value === ws) {
                reconnect();
            }
            // closed by disconnect or closed by server
            if (!websocketRef.value || websocketRef.value === ws) {
                readyState.value = ws.readyState || ReadyState.Closed;
            }
        };
        websocketRef.value = ws;
    };
    const sendMessage = (0, useMemoizedFn_1.default)((message) => {
        if (readyStateRef.value.value === ReadyState.Open) {
            websocketRef.value?.send(message);
        }
        else {
            throw new Error('WebSocket disconnected');
        }
    });
    const connect = (0, useMemoizedFn_1.default)(() => {
        reconnectTimesRef.value = 0;
        connectWs();
    });
    const disconnect = (0, useMemoizedFn_1.default)(() => {
        if (reconnectTimerRef.value) {
            clearTimeout(reconnectTimerRef.value);
        }
        reconnectTimesRef.value = reconnectLimit;
        websocketRef.value?.close();
        websocketRef.value = undefined;
    });
    (0, vue_1.watch)(() => [socketUrl, manual], ([newSocketUrl, newManual]) => {
        if (!newManual && newSocketUrl) {
            connect();
        }
    }, { immediate: true });
    (0, vue_1.onUnmounted)(() => {
        disconnect();
    });
    return {
        latestMessage,
        sendMessage,
        connect,
        disconnect,
        readyState,
        webSocketIns: websocketRef,
    };
}
exports.default = useWebSocket;
