"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
function useSet(initialValue) {
    const getInitValue = () => new Set(initialValue);
    const set = (0, vue_1.ref)(getInitValue());
    const updateSet = (updater) => {
        set.value = updater(new Set(set.value));
    };
    const add = (0, useMemoizedFn_1.default)((key) => {
        if (set.value.has(key)) {
            return;
        }
        updateSet((newSet) => {
            newSet.add(key);
            return newSet;
        });
    });
    const remove = (0, useMemoizedFn_1.default)((key) => {
        if (!set.value.has(key)) {
            return;
        }
        updateSet((newSet) => {
            newSet.delete(key);
            return newSet;
        });
    });
    const reset = (0, useMemoizedFn_1.default)(() => {
        set.value = getInitValue();
    });
    return [
        set,
        {
            add,
            remove,
            reset,
        },
    ];
}
exports.default = useSet;