"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const utils_1 = require("../utils");
const useInterval = (fn, delay, options = {}) => {
    const timerCallback = (0, useMemoizedFn_1.default)(fn);
    const timerRef = (0, vue_1.ref)(null);
    const clear = () => {
        if (timerRef.value) {
            clearInterval(timerRef.value);
            timerRef.value = null;
        }
    };
    (0, vue_1.watch)(() => [delay, options.immediate], ([newDelay, immediate]) => {
        clear();
        if (!(0, utils_1.isNumber)(newDelay) || newDelay < 0) {
            return;
        }
        if (immediate) {
            timerCallback();
        }
        timerRef.value = setInterval(timerCallback, newDelay);
    }, { immediate: true });
    (0, vue_1.onUnmounted)(() => {
        clear();
    });
    return clear;
};
exports.default = useInterval;