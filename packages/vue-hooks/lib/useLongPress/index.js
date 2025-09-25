"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const domTarget_1 = require("../utils/domTarget");
function useLongPress(onLongPress, target, { delay = 300, moveThreshold, onClick, onLongPressEnd } = {}) {
    const onLongPressRef = (0, useLatest_1.default)(onLongPress);
    const onClickRef = (0, useLatest_1.default)(onClick);
    const onLongPressEndRef = (0, useLatest_1.default)(onLongPressEnd);
    const timerRef = (0, vue_1.ref)();
    const isTriggeredRef = (0, vue_1.ref)(false);
    const pervPositionRef = (0, vue_1.ref)({ x: 0, y: 0 });
    const mousePressed = (0, vue_1.ref)(false);
    const touchPressed = (0, vue_1.ref)(false);
    const hasMoveThreshold = !!((moveThreshold?.x && moveThreshold.x > 0) ||
        (moveThreshold?.y && moveThreshold.y > 0));
    let cleanup;
    function getClientPosition(event) {
        if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
            return {
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY,
            };
        }
        if (event instanceof MouseEvent) {
            return {
                clientX: event.clientX,
                clientY: event.clientY,
            };
        }
        return { clientX: 0, clientY: 0 };
    }
    const overThreshold = (event) => {
        const { clientX, clientY } = getClientPosition(event);
        const offsetX = Math.abs(clientX - pervPositionRef.value.x);
        const offsetY = Math.abs(clientY - pervPositionRef.value.y);
        return !!((moveThreshold?.x && offsetX > moveThreshold.x) ||
            (moveThreshold?.y && offsetY > moveThreshold.y));
    };
    const createTimer = (event) => {
        timerRef.value = setTimeout(() => {
            onLongPressRef.value(event);
            isTriggeredRef.value = true;
        }, delay);
    };
    const onTouchStart = (event) => {
        if (touchPressed.value) {
            return;
        }
        touchPressed.value = true;
        if (hasMoveThreshold) {
            const { clientX, clientY } = getClientPosition(event);
            pervPositionRef.value.x = clientX;
            pervPositionRef.value.y = clientY;
        }
        createTimer(event);
    };
    const onMouseDown = (event) => {
        if (event?.sourceCapabilities?.firesTouchEvents) {
            return;
        }
        mousePressed.value = true;
        if (hasMoveThreshold) {
            pervPositionRef.value.x = event.clientX;
            pervPositionRef.value.y = event.clientY;
        }
        createTimer(event);
    };
    const onMove = (event) => {
        if (timerRef.value && overThreshold(event)) {
            clearTimeout(timerRef.value);
            timerRef.value = undefined;
        }
    };
    const onTouchEnd = (event) => {
        if (!touchPressed.value) {
            return;
        }
        touchPressed.value = false;
        if (timerRef.value) {
            clearTimeout(timerRef.value);
            timerRef.value = undefined;
        }
        if (isTriggeredRef.value) {
            onLongPressEndRef.value?.(event);
        }
        else if (onClickRef.value) {
            onClickRef.value(event);
        }
        isTriggeredRef.value = false;
    };
    const onMouseUp = (event) => {
        if (event?.sourceCapabilities?.firesTouchEvents) {
            return;
        }
        if (!mousePressed.value) {
            return;
        }
        mousePressed.value = false;
        if (timerRef.value) {
            clearTimeout(timerRef.value);
            timerRef.value = undefined;
        }
        if (isTriggeredRef.value) {
            onLongPressEndRef.value?.(event);
        }
        else if (onClickRef.value) {
            onClickRef.value(event);
        }
        isTriggeredRef.value = false;
    };
    const onMouseLeave = (event) => {
        if (!mousePressed.value) {
            return;
        }
        mousePressed.value = false;
        if (timerRef.value) {
            clearTimeout(timerRef.value);
            timerRef.value = undefined;
        }
        if (isTriggeredRef.value) {
            onLongPressEndRef.value?.(event);
            isTriggeredRef.value = false;
        }
    };
    const setupListeners = () => {
        cleanup?.();
        const targetElement = (0, domTarget_1.getTargetElement)(target);
        if (!targetElement?.addEventListener) {
            return;
        }
        targetElement.addEventListener('mousedown', onMouseDown);
        targetElement.addEventListener('mouseup', onMouseUp);
        targetElement.addEventListener('mouseleave', onMouseLeave);
        targetElement.addEventListener('touchstart', onTouchStart);
        targetElement.addEventListener('touchend', onTouchEnd);
        if (hasMoveThreshold) {
            targetElement.addEventListener('mousemove', onMove);
            targetElement.addEventListener('touchmove', onMove);
        }
        cleanup = () => {
            if (timerRef.value) {
                clearTimeout(timerRef.value);
                isTriggeredRef.value = false;
            }
            targetElement.removeEventListener('mousedown', onMouseDown);
            targetElement.removeEventListener('mouseup', onMouseUp);
            targetElement.removeEventListener('mouseleave', onMouseLeave);
            targetElement.removeEventListener('touchstart', onTouchStart);
            targetElement.removeEventListener('touchend', onTouchEnd);
            if (hasMoveThreshold) {
                targetElement.removeEventListener('mousemove', onMove);
                targetElement.removeEventListener('touchmove', onMove);
            }
        };
    };
    (0, vue_1.watch)(() => target, setupListeners, { immediate: true, flush: 'post' });
    (0, vue_1.onUnmounted)(() => {
        cleanup?.();
    });
}
exports.default = useLongPress;
