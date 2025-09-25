"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useCreation_1 = __importDefault(require("../useCreation"));
const useResetState = (initialState) => {
    const initialStateRef = (0, vue_1.ref)(initialState);
    const initialStateMemo = (0, useCreation_1.default)(() => (0, utils_1.isFunction)(initialStateRef.value) ? initialStateRef.value() : initialStateRef.value, []);
    const state = (0, vue_1.ref)(initialStateMemo);
    const setState = (value) => {
        if ((0, utils_1.isFunction)(value)) {
            state.value = value(state.value);
        }
        else {
            state.value = value;
        }
    };
    const resetState = (0, useMemoizedFn_1.default)(() => {
        state.value = initialStateMemo;
    });
    return [state, setState, resetState];
};
exports.default = useResetState;