"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_cookie_1 = __importDefault(require("js-cookie"));
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const utils_1 = require("../utils");
function useCookieState(cookieKey, options = {}) {
    const state = (0, vue_1.ref)((() => {
        const cookieValue = js_cookie_1.default.get(cookieKey);
        if ((0, utils_1.isString)(cookieValue)) {
            return cookieValue;
        }
        if ((0, utils_1.isFunction)(options.defaultValue)) {
            return options.defaultValue();
        }
        return options.defaultValue;
    })());
    const updateState = (0, useMemoizedFn_1.default)((newValue, newOptions = {}) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { defaultValue, ...restOptions } = { ...options, ...newOptions };
        const value = (0, utils_1.isFunction)(newValue) ? newValue(state.value) : newValue;
        state.value = value;
        if (value === undefined) {
            js_cookie_1.default.remove(cookieKey);
        }
        else {
            js_cookie_1.default.set(cookieKey, value, restOptions);
        }
    });
    return [state, updateState];
}
exports.default = useCookieState;