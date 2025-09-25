"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useBoolean;
const useToggle_1 = require("../useToggle");
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
