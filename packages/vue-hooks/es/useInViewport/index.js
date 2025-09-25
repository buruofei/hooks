"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const domTarget_1 = require("../utils/domTarget");
function useInViewport(target, options) {
    const { callback, ...option } = options || {};
    const state = (0, vue_1.ref)();
    const ratio = (0, vue_1.ref)();
    let observer = null;
    const cleanup = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };
    const setupObserver = () => {
        cleanup();
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }
        const targets = Array.isArray(target) ? target : [target];
        const els = targets.map((element) => (0, domTarget_1.getTargetElement)(element)).filter(Boolean);
        if (!els.length) {
            return;
        }
        observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                ratio.value = entry.intersectionRatio;
                state.value = entry.isIntersecting;
                callback?.(entry);
            }
        }, {
            ...option,
            root: (0, domTarget_1.getTargetElement)(options?.root),
        });
        els.forEach((el) => observer.observe(el));
    };
    (0, vue_1.watch)(() => [target, options?.rootMargin, options?.threshold], setupObserver, {
        immediate: true,
        flush: 'post',
        deep: true
    });
    (0, vue_1.onUnmounted)(() => {
        cleanup();
    });
    return [state, ratio];
}
exports.default = useInViewport;