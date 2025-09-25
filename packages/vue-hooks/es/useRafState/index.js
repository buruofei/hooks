"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
function useRafState(initialState) {
    const rafRef = (0, vue_1.ref)(0);
    const state = (0, vue_1.ref)(typeof initialState === 'function' ? initialState() : initialState);
    const setRafState = (0, useMemoizedFn_1.default)((value) => {
        cancelAnimationFrame(rafRef.value);
        rafRef.value = requestAnimationFrame(() => {
            state.value = typeof value === 'function' ? value(state.value) : value;
        });
    });
    (0, vue_1.onUnmounted)(() => {
        cancelAnimationFrame(rafRef.value);
    });
    return [state, setRafState];
}
exports.default = useRafState;