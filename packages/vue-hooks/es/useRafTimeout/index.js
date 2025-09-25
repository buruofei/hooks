"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const utils_1 = require("../utils");
const setRafTimeout = (callback, delay = 0) => {
    if (typeof requestAnimationFrame === 'undefined') {
        return {
            id: setTimeout(callback, delay),
        };
    }
    const handle = {
        id: 0,
    };
    const startTime = Date.now();
    const loop = () => {
        const current = Date.now();
        if (current - startTime >= delay) {
            callback();
        }
        else {
            handle.id = requestAnimationFrame(loop);
        }
    };
    handle.id = requestAnimationFrame(loop);
    return handle;
};
const cancelAnimationFrameIsNotDefined = (t) => {
    return typeof cancelAnimationFrame === 'undefined';
};
const clearRafTimeout = (handle) => {
    if (cancelAnimationFrameIsNotDefined(handle.id)) {
        return clearTimeout(handle.id);
    }
    cancelAnimationFrame(handle.id);
};
function useRafTimeout(fn, delay) {
    const fnRef = (0, useLatest_1.default)(fn);
    const timerRef = (0, vue_1.ref)();
    const clear = () => {
        if (timerRef.value) {
            clearRafTimeout(timerRef.value);
            timerRef.value = undefined;
        }
    };
    (0, vue_1.watch)(() => delay, (newDelay) => {
        clear();
        if (!(0, utils_1.isNumber)(newDelay) || newDelay < 0) {
            return;
        }
        timerRef.value = setRafTimeout(() => {
            fnRef.value();
        }, newDelay);
    }, { immediate: true });
    (0, vue_1.onUnmounted)(() => {
        clear();
    });
    return clear;
}
exports.default = useRafTimeout;