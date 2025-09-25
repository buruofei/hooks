"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useHover;
const useBoolean_1 = __importDefault(require("../useBoolean"));
const useEventListener_1 = __importDefault(require("../useEventListener"));
function useHover(target, options) {
    const { onEnter, onLeave, onChange } = options || {};
    const [state, { setTrue, setFalse }] = (0, useBoolean_1.default)(false);
    (0, useEventListener_1.default)('mouseenter', () => {
        onEnter?.();
        setTrue();
        onChange?.(true);
    }, {
        target,
    });
    (0, useEventListener_1.default)('mouseleave', () => {
        onLeave?.();
        setFalse();
        onChange?.(false);
    }, {
        target,
    });
    return state;
}