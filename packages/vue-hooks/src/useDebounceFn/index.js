"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const lodash_polyfill_1 = require("../utils/lodash-polyfill");
const useLatest_1 = require("../useLatest");
const utils_1 = require("../utils");
function useDebounceFn(fn, options) {
    if (process.env.NODE_ENV === 'development') {
        if (!(0, utils_1.isFunction)(fn)) {
            console.error(`useDebounceFn expected parameter is a function, got ${typeof fn}`);
        }
    }
    const fnRef = (0, useLatest_1.default)(fn);
    const wait = options?.wait ?? 1000;
    const debounced = (0, lodash_polyfill_1.debounce)((...args) => {
        return fnRef.value(...args);
    }, wait, options);
    (0, vue_1.onUnmounted)(() => {
        debounced.cancel();
    });
    return {
        run: debounced,
        cancel: debounced.cancel,
        flush: debounced.flush,
    };
}
exports.default = useDebounceFn;
