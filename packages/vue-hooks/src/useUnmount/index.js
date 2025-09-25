"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = require("../useLatest");
const utils_1 = require("../utils");
const useUnmount = (fn) => {
    if (process.env.NODE_ENV === 'development') {
        if (!(0, utils_1.isFunction)(fn)) {
            console.error(`useUnmount expected parameter is a function, got ${typeof fn}`);
        }
    }
    const fnRef = (0, useLatest_1.default)(fn);
    (0, vue_1.onUnmounted)(() => {
        fnRef.value();
    });
};
exports.default = useUnmount;
