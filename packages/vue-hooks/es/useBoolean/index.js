"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useBoolean;
const useToggle_1 = __importDefault(require("../useToggle"));
function useBoolean(defaultValue = false) {
    const [state, { toggle, set }] = (0, useToggle_1.default)(!!defaultValue);
    const actions = {
        toggle,
        set: (v) => set(!!v),
        setTrue: () => set(true),
        setFalse: () => set(false),
    };
    return [state, actions];
}