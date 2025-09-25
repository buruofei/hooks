"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const defaultShouldUpdate = (a, b) => !Object.is(a, b);
function usePrevious(state, shouldUpdate = defaultShouldUpdate) {
    const prevRef = (0, vue_1.ref)(undefined);
    const curRef = (0, vue_1.ref)(undefined);
    (0, vue_1.watch)(() => state, (newState) => {
        if (shouldUpdate(curRef.value, newState)) {
            prevRef.value = curRef.value;
            curRef.value = newState;
        }
    }, { immediate: true });
    return prevRef.value;
}
exports.default = usePrevious;