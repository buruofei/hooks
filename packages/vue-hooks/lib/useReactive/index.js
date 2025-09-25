"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
function useReactive(initialState) {
    // Vue 3's reactive system already provides the functionality we need
    // No need for custom proxy implementation like in React
    if (!(0, utils_1.isObject)(initialState)) {
        console.warn('useReactive only works with objects');
        return initialState;
    }
    return (0, vue_1.reactive)(initialState);
}
exports.default = useReactive;
