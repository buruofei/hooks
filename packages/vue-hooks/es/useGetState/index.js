"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const utils_1 = require("../utils");
function useGetState(initialState) {
    const state = (0, vue_1.ref)((0, utils_1.isFunction)(initialState) ? initialState() : initialState);
    const stateRef = (0, useLatest_1.default)(state);
    const setState = (value) => {
        if ((0, utils_1.isFunction)(value)) {
            state.value = value(state.value);
        }
        else {
            state.value = value;
        }
    };
    const getState = (0, useMemoizedFn_1.default)(() => stateRef.value.value);
    return [state, setState, getState];
}
exports.default = useGetState;