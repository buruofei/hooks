"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const domTarget_1 = require("../utils/domTarget");
const useLatest_1 = __importDefault(require("../useLatest"));
// Note: useDeepCompareEffectWithTarget is complex, we'll use a simpler approach
const useMutationObserver = (callback, target, options = {}) => {
    const callbackRef = (0, useLatest_1.default)(callback);
    let observer = null;
    const cleanup = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };
    const setup = () => {
        cleanup();
        const element = (0, domTarget_1.getTargetElement)(target);
        if (!element) {
            return;
        }
        observer = new MutationObserver(callbackRef.value);
        observer.observe(element, options);
    };
    (0, vue_1.watch)(() => target, () => {
        setup();
    }, { immediate: true, deep: true });
    (0, vue_1.watch)(() => options, () => {
        setup();
    }, { deep: true });
    (0, vue_1.onUnmounted)(() => {
        cleanup();
    });
};
exports.default = useMutationObserver;