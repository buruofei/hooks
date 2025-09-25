"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const domTarget_1 = require("../utils/domTarget");
const useLatest_1 = __importDefault(require("../useLatest"));
const initRect = {
    top: NaN,
    left: NaN,
    bottom: NaN,
    right: NaN,
    height: NaN,
    width: NaN,
};
const initState = {
    text: '',
    ...initRect,
};
function getRectFromSelection(selection) {
    if (!selection) {
        return initRect;
    }
    if (selection.rangeCount < 1) {
        return initRect;
    }
    const range = selection.getRangeAt(0);
    const { height, width, top, left, right, bottom } = range.getBoundingClientRect();
    return {
        height,
        width,
        top,
        left,
        right,
        bottom,
    };
}
function useTextSelection(target) {
    const state = (0, vue_1.ref)(initState);
    const stateRef = (0, useLatest_1.default)(state);
    const isInRangeRef = (0, vue_1.ref)(false);
    let mouseupHandler = null;
    let mousedownHandler = null;
    const setup = () => {
        const el = (0, domTarget_1.getTargetElement)(target, document);
        if (!el) {
            return;
        }
        mouseupHandler = () => {
            let selObj = null;
            let text = '';
            let rect = initRect;
            if (!window.getSelection) {
                return;
            }
            selObj = window.getSelection();
            text = selObj ? selObj.toString() : '';
            if (text && isInRangeRef.value) {
                rect = getRectFromSelection(selObj);
                state.value = { ...stateRef.value, text, ...rect };
            }
        };
        mousedownHandler = (e) => {
            // 如果是鼠标右键需要跳过 这样选中的数据就不会被清空
            if (e.button === 2) {
                return;
            }
            if (!window.getSelection) {
                return;
            }
            if (stateRef.value.text) {
                state.value = { ...initState };
            }
            isInRangeRef.value = false;
            const selObj = window.getSelection();
            if (!selObj) {
                return;
            }
            selObj.removeAllRanges();
            isInRangeRef.value = el.contains(e.target);
        };
        el.addEventListener('mouseup', mouseupHandler);
        document.addEventListener('mousedown', mousedownHandler);
    };
    const cleanup = () => {
        const el = (0, domTarget_1.getTargetElement)(target, document);
        if (el && mouseupHandler) {
            el.removeEventListener('mouseup', mouseupHandler);
        }
        if (mousedownHandler) {
            document.removeEventListener('mousedown', mousedownHandler);
        }
    };
    (0, vue_1.watch)(() => target, () => {
        cleanup();
        setup();
    }, { immediate: true, deep: true });
    (0, vue_1.onUnmounted)(() => {
        cleanup();
    });
    return state;
}
exports.default = useTextSelection;