"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const utils_1 = require("../utils");
function useSelections(items, options) {
    let defaultSelected = [];
    let itemKey;
    if (Array.isArray(options)) {
        defaultSelected = options;
    }
    else if ((0, utils_1.isObject)(options)) {
        defaultSelected = options?.defaultSelected ?? defaultSelected;
        itemKey = options?.itemKey ?? itemKey;
    }
    const getKey = (item) => {
        if ((0, utils_1.isFunction)(itemKey)) {
            return itemKey(item);
        }
        if ((0, utils_1.isString)(itemKey) && (0, utils_1.isObject)(item)) {
            return item[itemKey];
        }
        return item;
    };
    const selected = (0, vue_1.ref)(defaultSelected);
    const selectedMap = (0, vue_1.computed)(() => {
        const keyToItemMap = new Map();
        if (!Array.isArray(selected.value)) {
            return keyToItemMap;
        }
        selected.value.forEach((item) => {
            keyToItemMap.set(getKey(item), item);
        });
        return keyToItemMap;
    });
    const isSelected = (0, useMemoizedFn_1.default)((item) => selectedMap.value.has(getKey(item)));
    const select = (0, useMemoizedFn_1.default)((item) => {
        const newMap = new Map(selectedMap.value);
        newMap.set(getKey(item), item);
        selected.value = Array.from(newMap.values());
    });
    const unSelect = (0, useMemoizedFn_1.default)((item) => {
        const newMap = new Map(selectedMap.value);
        newMap.delete(getKey(item));
        selected.value = Array.from(newMap.values());
    });
    const toggle = (0, useMemoizedFn_1.default)((item) => {
        if (isSelected(item)) {
            unSelect(item);
        }
        else {
            select(item);
        }
    });
    const selectAll = (0, useMemoizedFn_1.default)(() => {
        const newMap = new Map(selectedMap.value);
        items.forEach((item) => {
            newMap.set(getKey(item), item);
        });
        selected.value = Array.from(newMap.values());
    });
    const unSelectAll = (0, useMemoizedFn_1.default)(() => {
        const newMap = new Map(selectedMap.value);
        items.forEach((item) => {
            newMap.delete(getKey(item));
        });
        selected.value = Array.from(newMap.values());
    });
    const noneSelected = (0, vue_1.computed)(() => items.every((item) => !selectedMap.value.has(getKey(item))));
    const allSelected = (0, vue_1.computed)(() => items.every((item) => selectedMap.value.has(getKey(item))) && !noneSelected.value);
    const partiallySelected = (0, vue_1.computed)(() => !noneSelected.value && !allSelected.value);
    const toggleAll = (0, useMemoizedFn_1.default)(() => (allSelected.value ? unSelectAll() : selectAll()));
    const clearAll = (0, useMemoizedFn_1.default)(() => {
        selected.value = [];
    });
    const setSelected = (newSelected) => {
        selected.value = newSelected;
    };
    return {
        selected,
        noneSelected,
        allSelected,
        partiallySelected,
        setSelected: (0, useMemoizedFn_1.default)(setSelected),
        isSelected,
        select,
        unSelect,
        toggle,
        selectAll,
        unSelectAll,
        clearAll,
        toggleAll,
    };
}
exports.default = useSelections;