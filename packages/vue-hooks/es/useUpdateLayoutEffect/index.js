"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
// Vue equivalent of React's useUpdateLayoutEffect
function useUpdateLayoutEffect(effect, deps, options) {
    let isMounted = false;
    (0, vue_1.onMounted)(() => {
        isMounted = true;
    });
    (0, vue_1.watch)(deps, (newVal, oldVal, onCleanup) => {
        if (!isMounted) {
            return;
        }
        return effect(newVal, oldVal, onCleanup);
    }, { ...options, flush: 'post' } // Use 'post' flush for layout effect timing
    );
}
exports.default = useUpdateLayoutEffect;