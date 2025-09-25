"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
function useUnmountedRef() {
    const unmountedRef = (0, vue_1.ref)(false);
    (0, vue_1.onUnmounted)(() => {
        unmountedRef.value = true;
    });
    return unmountedRef;
}
exports.default = useUnmountedRef;
