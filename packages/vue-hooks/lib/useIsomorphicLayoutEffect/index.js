"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const isBrowser_1 = __importDefault(require("../utils/isBrowser"));
// In Vue 3, there's no direct equivalent to useLayoutEffect
// We use onMounted for server-side compatibility and watch for reactivity
const useIsomorphicLayoutEffect = (effect, deps, options) => {
    if (isBrowser_1.default) {
        // Use immediate watch in browser
        if (deps) {
            (0, vue_1.watch)(deps, effect, { ...options, immediate: true });
        }
        else {
            (0, vue_1.onMounted)(() => {
                effect(undefined, undefined, () => { });
            });
        }
    }
    else {
        // On server, just run on mount
        (0, vue_1.onMounted)(() => {
            if (deps) {
                (0, vue_1.watch)(deps, effect, options);
            }
            else {
                effect(undefined, undefined, () => { });
            }
        });
    }
};
exports.default = useIsomorphicLayoutEffect;
