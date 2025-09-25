"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const isBrowser_1 = __importDefault(require("../utils/isBrowser"));
const DEFAULT_OPTIONS = {
    restoreOnUnmount: false,
};
function useTitle(title, options = DEFAULT_OPTIONS) {
    const originalTitle = (0, vue_1.ref)(isBrowser_1.default ? document.title : '');
    (0, vue_1.watch)(() => title, (newTitle) => {
        if (isBrowser_1.default) {
            document.title = newTitle;
        }
    }, { immediate: true });
    (0, vue_1.onUnmounted)(() => {
        if (options.restoreOnUnmount && isBrowser_1.default) {
            document.title = originalTitle.value;
        }
    });
}
exports.default = useTitle;