"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useMouse;
const useRafState_1 = __importDefault(require("../useRafState"));
const useEventListener_1 = __importDefault(require("../useEventListener"));
const domTarget_1 = require("../utils/domTarget");
const initState = {
    screenX: NaN,
    screenY: NaN,
    clientX: NaN,
    clientY: NaN,
    pageX: NaN,
    pageY: NaN,
    elementX: NaN,
    elementY: NaN,
    elementH: NaN,
    elementW: NaN,
    elementPosX: NaN,
    elementPosY: NaN,
};
function useMouse(target) {
    const [state, setState] = (0, useRafState_1.default)(initState);
    (0, useEventListener_1.default)('mousemove', (event) => {
        const { screenX, screenY, clientX, clientY, pageX, pageY } = event;
        const newState = {
            screenX,
            screenY,
            clientX,
            clientY,
            pageX,
            pageY,
            elementX: NaN,
            elementY: NaN,
            elementH: NaN,
            elementW: NaN,
            elementPosX: NaN,
            elementPosY: NaN,
        };
        const targetElement = (0, domTarget_1.getTargetElement)(target);
        if (targetElement) {
            const { left, top, width, height } = targetElement.getBoundingClientRect();
            newState.elementPosX = left + window.pageXOffset;
            newState.elementPosY = top + window.pageYOffset;
            newState.elementX = pageX - newState.elementPosX;
            newState.elementY = pageY - newState.elementPosY;
            newState.elementW = width;
            newState.elementH = height;
        }
        setState(newState);
    }, {
        target: () => document,
    });
    return state;
}