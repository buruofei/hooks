"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const utils_1 = require("../utils");
const calcLeft = (target) => {
    if (!target) {
        return 0;
    }
    const targetTime = typeof target === 'string' ? new Date(target).getTime() :
        typeof target === 'number' ? target :
            target.getTime();
    const left = targetTime - Date.now();
    return left < 0 ? 0 : left;
};
const parseMs = (milliseconds) => {
    return {
        days: Math.floor(milliseconds / 86400000),
        hours: Math.floor(milliseconds / 3600000) % 24,
        minutes: Math.floor(milliseconds / 60000) % 60,
        seconds: Math.floor(milliseconds / 1000) % 60,
        milliseconds: Math.floor(milliseconds) % 1000,
    };
};
const useCountDown = (options = {}) => {
    const { leftTime, targetDate, interval = 1000, onEnd } = options || {};
    const memoLeftTime = (0, vue_1.computed)(() => {
        return (0, utils_1.isNumber)(leftTime) && leftTime > 0 ? Date.now() + leftTime : undefined;
    });
    const target = (0, vue_1.computed)(() => 'leftTime' in options ? memoLeftTime.value : targetDate);
    const timeLeft = (0, vue_1.ref)(calcLeft(target.value));
    const onEndRef = (0, useLatest_1.default)(onEnd);
    let timer = null;
    const clearTimer = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };
    const startTimer = () => {
        clearTimer();
        if (!target.value) {
            // for stop
            timeLeft.value = 0;
            return;
        }
        // 立即执行一次
        timeLeft.value = calcLeft(target.value);
        timer = setInterval(() => {
            const targetLeft = calcLeft(target.value);
            timeLeft.value = targetLeft;
            if (targetLeft === 0) {
                clearTimer();
                onEndRef.value?.();
            }
        }, interval);
    };
    (0, vue_1.watch)(() => [target.value, interval], startTimer, { immediate: true });
    (0, vue_1.onUnmounted)(() => {
        clearTimer();
    });
    const formattedRes = (0, vue_1.computed)(() => parseMs(timeLeft.value));
    return [timeLeft, formattedRes];
};
exports.default = useCountDown;
