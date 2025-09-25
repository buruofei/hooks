"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configResponsive = configResponsive;
const vue_1 = require("vue");
const isBrowser_1 = __importDefault(require("../utils/isBrowser"));
const subscribers = new Set();
let info;
let responsiveConfig = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
};
function handleResize() {
    const oldInfo = info;
    calculate();
    if (oldInfo === info) {
        return;
    }
    subscribers.forEach(subscriber => {
        subscriber();
    });
}
let listening = false;
function calculate() {
    const width = window.innerWidth;
    const newInfo = {};
    let shouldUpdate = false;
    for (const key of Object.keys(responsiveConfig)) {
        newInfo[key] = width >= responsiveConfig[key];
        if (newInfo[key] !== info[key]) {
            shouldUpdate = true;
        }
    }
    if (shouldUpdate) {
        info = newInfo;
    }
}
function configResponsive(config) {
    responsiveConfig = config;
    if (info)
        calculate();
}
function useResponsive() {
    if (isBrowser_1.default && !listening) {
        info = {};
        calculate();
        window.addEventListener('resize', handleResize);
        listening = true;
    }
    const state = (0, vue_1.ref)(info || {});
    (0, vue_1.onMounted)(() => {
        if (!isBrowser_1.default) {
            return;
        }
        if (!listening) {
            window.addEventListener('resize', handleResize);
        }
        const subscriber = () => {
            state.value = { ...info };
        };
        subscribers.add(subscriber);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0) {
                window.removeEventListener('resize', handleResize);
                listening = false;
            }
        };
    });
    (0, vue_1.onUnmounted)(() => {
        if (!isBrowser_1.default) {
            return;
        }
        const subscriber = () => {
            state.value = { ...info };
        };
        subscribers.delete(subscriber);
        if (subscribers.size === 0) {
            window.removeEventListener('resize', handleResize);
            listening = false;
        }
    });
    return state;
}
exports.default = useResponsive;
