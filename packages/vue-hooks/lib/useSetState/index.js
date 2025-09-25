"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const utils_1 = require("../utils");
const useSetState = (initialState) => {
    const state = (0, vue_1.ref)((0, utils_1.isFunction)(initialState) ? initialState() : initialState);
    const setMergeState = (0, useMemoizedFn_1.default)((patch) => {
        const newState = (0, utils_1.isFunction)(patch) ? patch(state.value) : patch;
        if (newState) {
            state.value = { ...state.value, ...newState };
        }
    });
    return [state, setMergeState];
};
exports.default = useSetState;
