"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const domTarget_1 = require("../utils/domTarget");
function useEventListener(eventName, handler, options = {}) {
    const { enable = true } = options;
    const handlerRef = (0, useLatest_1.default)(handler);
    let cleanup;
    const addListener = () => {
        if (!enable) {
            return;
        }
        const targetElement = (0, domTarget_1.getTargetElement)(options.target, window);
        if (!targetElement?.addEventListener) {
            return;
        }
        const eventListener = (event) => {
            return handlerRef.value(event);
        };
        const eventNameArray = Array.isArray(eventName) ? eventName : [eventName];
        eventNameArray.forEach((event) => {
            targetElement.addEventListener(event, eventListener, {
                capture: options.capture,
                once: options.once,
                passive: options.passive,
            });
        });
        return () => {
            eventNameArray.forEach((event) => {
                targetElement.removeEventListener(event, eventListener, {
                    capture: options.capture,
                });
            });
        };
    };
    const removeListener = () => {
        cleanup?.();
        cleanup = undefined;
    };
    // Watch for changes in enable state and target
    (0, vue_1.watch)(() => [enable, options.target], () => {
        removeListener();
        cleanup = addListener();
    }, { immediate: true, flush: 'post' });
    (0, vue_1.onUnmounted)(() => {
        removeListener();
    });
}
exports.default = useEventListener;
