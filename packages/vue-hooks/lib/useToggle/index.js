"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
function useToggle(defaultValue = false, reverseValue) {
    const state = (0, vue_1.ref)(defaultValue);
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue);
    const toggle = () => {
        state.value = state.value === defaultValue ? reverseValueOrigin : defaultValue;
    };
    const set = (value) => {
        state.value = value;
    };
    const setLeft = () => {
        state.value = defaultValue;
    };
    const setRight = () => {
        state.value = reverseValueOrigin;
    };
    const actions = {
        toggle,
        set,
        setLeft,
        setRight,
    };
    return [state, actions];
}
exports.default = useToggle;
