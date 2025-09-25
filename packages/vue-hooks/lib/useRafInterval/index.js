"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const utils_1 = require("../utils");
const setRafInterval = (callback, delay = 0) => {
    if (typeof requestAnimationFrame === 'undefined') {
        return {
            id: setInterval(callback, delay),
        };
    }
    let start = Date.now();
    const handle = {
        id: 0,
    };
    const loop = () => {
        const current = Date.now();
        if (current - start >= delay) {
            callback();
            start = Date.now();
        }
        handle.id = requestAnimationFrame(loop);
    };
    handle.id = requestAnimationFrame(loop);
    return handle;
};
const cancelAnimationFrameIsNotDefined = (t) => {
    return typeof cancelAnimationFrame === 'undefined';
};
const clearRafInterval = (handle) => {
    if (cancelAnimationFrameIsNotDefined(handle.id)) {
        return clearInterval(handle.id);
    }
    cancelAnimationFrame(handle.id);
};
function useRafInterval(fn, delay, options) {
    const immediate = options?.immediate;
    const fnRef = (0, useLatest_1.default)(fn);
    const timerRef = (0, vue_1.ref)();
    const clear = () => {
        if (timerRef.value) {
            clearRafInterval(timerRef.value);
            timerRef.value = undefined;
        }
    };
    (0, vue_1.watch)(() => delay, (newDelay) => {
        clear();
        if (!(0, utils_1.isNumber)(newDelay) || newDelay < 0) {
            return;
        }
        if (immediate) {
            fnRef.value();
        }
        timerRef.value = setRafInterval(() => {
            fnRef.value();
        }, newDelay);
    }, { immediate: true });
    (0, vue_1.onUnmounted)(() => {
        clear();
    });
    return clear;
}
exports.default = useRafInterval;
