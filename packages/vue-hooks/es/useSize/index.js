"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useRafState_1 = __importDefault(require("../useRafState"));
const domTarget_1 = require("../utils/domTarget");
function useSize(target) {
    const [state, setState] = (0, useRafState_1.default)(() => {
        const el = (0, domTarget_1.getTargetElement)(target);
        return el ? { width: el.clientWidth, height: el.clientHeight } : undefined;
    });
    let resizeObserver = null;
    const cleanup = () => {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
    };
    const observe = () => {
        cleanup();
        const el = (0, domTarget_1.getTargetElement)(target);
        if (!el) {
            setState(undefined);
            return;
        }
        // Initialize state
        setState({ width: el.clientWidth, height: el.clientHeight });
        // Use ResizeObserver if available, otherwise fallback to window resize
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    const { clientWidth, clientHeight } = entry.target;
                    setState({ width: clientWidth, height: clientHeight });
                });
            });
            resizeObserver.observe(el);
        }
    };
    (0, vue_1.watch)(() => target, observe, { immediate: true, flush: 'post' });
    (0, vue_1.onUnmounted)(() => {
        cleanup();
    });
    return state;
}
exports.default = useSize;