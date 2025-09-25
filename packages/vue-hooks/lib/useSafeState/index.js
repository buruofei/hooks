"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useUnmountedRef_1 = __importDefault(require("../useUnmountedRef"));
const utils_1 = require("../utils");
function useSafeState(initialState) {
    const unmountedRef = (0, useUnmountedRef_1.default)();
    const state = (0, vue_1.ref)((0, utils_1.isFunction)(initialState) ? initialState() : initialState);
    const setCurrentState = (currentState) => {
        /** if component is unmounted, stop update */
        if (unmountedRef.value) {
            return;
        }
        if ((0, utils_1.isFunction)(currentState)) {
            state.value = currentState(state.value);
        }
        else {
            state.value = currentState;
        }
    };
    return [state, setCurrentState];
}
exports.default = useSafeState;
