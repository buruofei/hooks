"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useUpdate_1 = __importDefault(require("../useUpdate"));
function useControllableValue(defaultProps = {}, options = {}) {
    const props = defaultProps;
    const { defaultValue, defaultValuePropName = 'defaultValue', valuePropName = 'value', trigger = 'onChange', } = options;
    const value = props[valuePropName];
    const isControlled = Object.prototype.hasOwnProperty.call(props, valuePropName);
    const initialValue = (0, vue_1.computed)(() => {
        if (isControlled) {
            return value;
        }
        if (Object.prototype.hasOwnProperty.call(props, defaultValuePropName)) {
            return props[defaultValuePropName];
        }
        return defaultValue;
    });
    const stateRef = (0, vue_1.ref)(initialValue.value);
    if (isControlled) {
        stateRef.value = value;
    }
    const update = (0, useUpdate_1.default)();
    const setState = (0, useMemoizedFn_1.default)((v, ...args) => {
        const r = (0, utils_1.isFunction)(v) ? v(stateRef.value) : v;
        if (!isControlled) {
            stateRef.value = r;
            update();
        }
        if (props[trigger]) {
            props[trigger](r, ...args);
        }
    });
    return [isControlled ? value : stateRef.value, setState];
}
exports.default = useControllableValue;