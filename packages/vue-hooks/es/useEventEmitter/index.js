"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
class EventEmitter {
    constructor() {
        this.subscriptions = new Set();
        this.emit = (val) => {
            this.subscriptions.forEach(subscription => {
                subscription(val);
            });
        };
        this.useSubscription = (callback) => {
            const callbackRef = (0, useLatest_1.default)(callback);
            const subscription = (val) => {
                callbackRef.value(val);
            };
            this.subscriptions.add(subscription);
            (0, vue_1.onUnmounted)(() => {
                this.subscriptions.delete(subscription);
            });
        };
    }
}
exports.EventEmitter = EventEmitter;
function useEventEmitter() {
    const emitterRef = (0, vue_1.ref)();
    if (!emitterRef.value) {
        emitterRef.value = new EventEmitter();
    }
    return emitterRef.value;
}
exports.default = useEventEmitter;