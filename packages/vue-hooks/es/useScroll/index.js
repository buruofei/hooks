"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useRafState_1 = __importDefault(require("../useRafState"));
const useLatest_1 = __importDefault(require("../useLatest"));
const domTarget_1 = require("../utils/domTarget");
function useScroll(target, shouldUpdate = () => true) {
    const [position, setPosition] = (0, useRafState_1.default)(undefined);
    const shouldUpdateRef = (0, useLatest_1.default)(shouldUpdate);
    let cleanup;
    const setupListener = () => {
        cleanup?.();
        const el = (0, domTarget_1.getTargetElement)(target, document);
        if (!el) {
            return;
        }
        const updatePosition = () => {
            let newPosition;
            if (el === document) {
                if (document.scrollingElement) {
                    newPosition = {
                        left: document.scrollingElement.scrollLeft,
                        top: document.scrollingElement.scrollTop,
                    };
                }
                else {
                    // When in quirks mode, the scrollingElement attribute returns the HTML body element if it exists and is potentially scrollable, otherwise it returns null.
                    // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/scrollingElement
                    // https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
                    newPosition = {
                        left: Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft),
                        top: Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop),
                    };
                }
            }
            else {
                newPosition = {
                    left: el.scrollLeft,
                    top: el.scrollTop,
                };
            }
            if (shouldUpdateRef.value(newPosition)) {
                setPosition(newPosition);
            }
        };
        updatePosition();
        el.addEventListener('scroll', updatePosition);
        cleanup = () => {
            el.removeEventListener('scroll', updatePosition);
        };
    };
    (0, vue_1.watch)(() => target, setupListener, { immediate: true, flush: 'post' });
    (0, vue_1.onUnmounted)(() => {
        cleanup?.();
    });
    return position;
}
exports.default = useScroll;