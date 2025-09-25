"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useDebounceFn_1 = require("../useDebounceFn");
function useDebounce(value, options) {
    const debounced = (0, vue_1.ref)(value);
    const { run } = (0, useDebounceFn_1.default)(() => {
        debounced.value = value;
    }, options);
    (0, vue_1.watch)(() => value, () => {
        run();
    }, { immediate: true });
    return debounced;
}
exports.default = useDebounce;
