"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
function isAsyncGenerator(val) {
    return (0, utils_1.isFunction)(val[Symbol.asyncIterator]);
}
function useAsyncEffect(effect, deps) {
    let cancelled = false;
    const execute = async () => {
        const e = effect();
        cancelled = false;
        if (isAsyncGenerator(e)) {
            while (true) {
                const result = await e.next();
                if (result.done || cancelled) {
                    break;
                }
            }
        }
        else {
            await e;
        }
    };
    const cleanup = () => {
        cancelled = true;
    };
    if (deps) {
        (0, vue_1.watch)(deps, execute, { immediate: true });
    }
    else {
        // 如果没有依赖，只在组件挂载时执行一次
        execute();
    }
    (0, vue_1.onUnmounted)(() => {
        cleanup();
    });
}
exports.default = useAsyncEffect;
