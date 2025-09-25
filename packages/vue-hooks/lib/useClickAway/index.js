"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useClickAway;
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const domTarget_1 = require("../utils/domTarget");
const getDocumentOrShadow_1 = __importDefault(require("../utils/getDocumentOrShadow"));
function useClickAway(onClickAway, target, eventName = 'click') {
    const onClickAwayRef = (0, useLatest_1.default)(onClickAway);
    let cleanup;
    const addListener = () => {
        const handler = (event) => {
            const targets = Array.isArray(target) ? target : [target];
            if (targets.some((item) => {
                const targetElement = (0, domTarget_1.getTargetElement)(item);
                return !targetElement || targetElement.contains(event.target);
            })) {
                return;
            }
            onClickAwayRef.value(event);
        };
        const documentOrShadow = (0, getDocumentOrShadow_1.default)(target);
        const eventNames = Array.isArray(eventName) ? eventName : [eventName];
        eventNames.forEach((event) => documentOrShadow.addEventListener(event, handler));
        return () => {
            eventNames.forEach((event) => documentOrShadow.removeEventListener(event, handler));
        };
    };
    const removeListener = () => {
        cleanup?.();
        cleanup = undefined;
    };
    // Watch for changes in target and eventName
    (0, vue_1.watch)(() => [target, eventName], () => {
        removeListener();
        cleanup = addListener();
    }, { immediate: true, flush: 'post' });
    (0, vue_1.onUnmounted)(() => {
        removeListener();
    });
}
