"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const lodash_polyfill_1 = require("../utils/lodash-polyfill");
const useLatest_1 = __importDefault(require("../useLatest"));
const utils_1 = require("../utils");
function useThrottleFn(fn, options) {
    if (process.env.NODE_ENV === 'development') {
        if (!(0, utils_1.isFunction)(fn)) {
            console.error(`useThrottleFn expected parameter is a function, got ${typeof fn}`);
        }
    }
    const fnRef = (0, useLatest_1.default)(fn);
    const wait = options?.wait ?? 1000;
    const throttled = (0, lodash_polyfill_1.throttle)((...args) => {
        return fnRef.value(...args);
    }, wait, options);
    (0, vue_1.onUnmounted)(() => {
        throttled.cancel();
    });
    return {
        run: throttled,
        cancel: throttled.cancel,
        flush: throttled.flush,
    };
}
exports.default = useThrottleFn;