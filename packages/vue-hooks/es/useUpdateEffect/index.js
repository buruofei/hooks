"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
function useUpdateEffect(effect, deps, options) {
    let isMounted = false;
    (0, vue_1.onMounted)(() => {
        isMounted = true;
    });
    (0, vue_1.watch)(deps, (newVal, oldVal, onCleanup) => {
        if (!isMounted) {
            return;
        }
        return effect(newVal, oldVal, onCleanup);
    }, options);
}
exports.default = useUpdateEffect;