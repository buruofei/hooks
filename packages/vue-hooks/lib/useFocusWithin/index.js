"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const domTarget_1 = require("../utils/domTarget");
function useFocusWithin(target, options) {
    const isFocusWithin = (0, vue_1.ref)(false);
    let cleanup = null;
    const setup = () => {
        if (cleanup) {
            cleanup();
        }
        const el = (0, domTarget_1.getTargetElement)(target);
        if (!el)
            return;
        const onFocusIn = (e) => {
            if (!isFocusWithin.value) {
                isFocusWithin.value = true;
                options?.onFocus?.(e);
                options?.onChange?.(true);
            }
        };
        const onFocusOut = (e) => {
            // Check if the new focus target is still within the element
            if (isFocusWithin.value &&
                (!e.relatedTarget || !el.contains(e.relatedTarget))) {
                isFocusWithin.value = false;
                options?.onBlur?.(e);
                options?.onChange?.(false);
            }
        };
        el.addEventListener('focusin', onFocusIn);
        el.addEventListener('focusout', onFocusOut);
        cleanup = () => {
            el.removeEventListener('focusin', onFocusIn);
            el.removeEventListener('focusout', onFocusOut);
        };
    };
    (0, vue_1.watch)(() => target, () => {
        setup();
    }, { immediate: true, deep: true });
    (0, vue_1.onUnmounted)(() => {
        if (cleanup) {
            cleanup();
        }
    });
    return isFocusWithin;
}
exports.default = useFocusWithin;
