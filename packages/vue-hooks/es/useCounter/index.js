"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
function getTargetValue(val, options = {}) {
    const { min, max } = options;
    let target = val;
    if ((0, utils_1.isNumber)(max)) {
        target = Math.min(max, target);
    }
    if ((0, utils_1.isNumber)(min)) {
        target = Math.max(min, target);
    }
    return target;
}
function useCounter(initialValue = 0, options = {}) {
    const { min, max } = options;
    const current = (0, vue_1.ref)(getTargetValue(initialValue, { min, max }));
    const setValue = (value) => {
        const target = (0, utils_1.isNumber)(value) ? value : value(current.value);
        current.value = getTargetValue(target, { max, min });
    };
    const inc = (delta = 1) => {
        setValue((c) => c + delta);
    };
    const dec = (delta = 1) => {
        setValue((c) => c - delta);
    };
    const set = (value) => {
        setValue(value);
    };
    const reset = () => {
        setValue(initialValue);
    };
    return [
        current,
        {
            inc,
            dec,
            set,
            reset,
        },
    ];
}
exports.default = useCounter;