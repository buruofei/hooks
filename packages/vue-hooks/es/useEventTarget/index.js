"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const utils_1 = require("../utils");
function useEventTarget(options) {
    const { initialValue, transformer } = options || {};
    const value = (0, vue_1.ref)(initialValue);
    const transformerRef = (0, useLatest_1.default)(transformer);
    const reset = (0, useMemoizedFn_1.default)(() => {
        value.value = initialValue;
    });
    const onChange = (0, useMemoizedFn_1.default)((e) => {
        const _value = e.target.value;
        if ((0, utils_1.isFunction)(transformerRef.value)) {
            value.value = transformerRef.value(_value);
        }
        else {
            // no transformer => U and T should be the same
            value.value = _value;
        }
    });
    return [
        value,
        {
            onChange,
            reset,
        },
    ];
}
exports.default = useEventTarget;