"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
function useMap(initialValue) {
    const getInitValue = () => new Map(initialValue);
    const map = (0, vue_1.ref)(getInitValue());
    const set = (0, useMemoizedFn_1.default)((key, entry) => {
        const temp = new Map(map.value);
        temp.set(key, entry);
        map.value = temp;
    });
    const setAll = (0, useMemoizedFn_1.default)((newMap) => {
        map.value = new Map(newMap);
    });
    const remove = (0, useMemoizedFn_1.default)((key) => {
        const temp = new Map(map.value);
        temp.delete(key);
        map.value = temp;
    });
    const reset = (0, useMemoizedFn_1.default)(() => {
        map.value = getInitValue();
    });
    const get = (0, useMemoizedFn_1.default)((key) => map.value.get(key));
    return [
        map,
        {
            set,
            setAll,
            remove,
            reset,
            get,
        },
    ];
}
exports.default = useMap;