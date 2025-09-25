"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useThrottleFn_1 = require("../useThrottleFn");
function useThrottle(value, options) {
    const throttled = (0, vue_1.ref)(value);
    const { run } = (0, useThrottleFn_1.default)(() => {
        throttled.value = value;
    }, options);
    (0, vue_1.watch)(() => value, () => {
        run();
    }, { immediate: true });
    return throttled;
}
exports.default = useThrottle;
