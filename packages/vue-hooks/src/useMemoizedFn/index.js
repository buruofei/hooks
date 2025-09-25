"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
const useMemoizedFn = (fn) => {
    if (process.env.NODE_ENV === 'development') {
        if (!(0, utils_1.isFunction)(fn)) {
            console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
        }
    }
    const fnRef = (0, vue_1.ref)(fn);
    fnRef.value = fn;
    const memoizedFn = (0, vue_1.ref)();
    if (!memoizedFn.value) {
        memoizedFn.value = function (...args) {
            return fnRef.value.apply(this, args);
        };
    }
    return memoizedFn.value;
};
exports.default = useMemoizedFn;
