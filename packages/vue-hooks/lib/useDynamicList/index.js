"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useDynamicList = (initialList = []) => {
    const counterRef = (0, vue_1.ref)(-1);
    const keyList = (0, vue_1.ref)([]);
    const setKey = (index) => {
        counterRef.value += 1;
        keyList.value.splice(index, 0, counterRef.value);
    };
    const list = (0, vue_1.ref)([]);
    // Initialize
    initialList.forEach((_, index) => {
        setKey(index);
    });
    list.value = [...initialList];
    const resetList = (0, useMemoizedFn_1.default)((newList) => {
        keyList.value = [];
        counterRef.value = -1;
        newList.forEach((_, index) => {
            setKey(index);
        });
        list.value = [...newList];
    });
    const insert = (0, useMemoizedFn_1.default)((index, item) => {
        const temp = [...list.value];
        temp.splice(index, 0, item);
        setKey(index);
        list.value = temp;
    });
    const getKey = (0, useMemoizedFn_1.default)((index) => keyList.value[index]);
    const getIndex = (0, useMemoizedFn_1.default)((key) => keyList.value.findIndex((ele) => ele === key));
    const merge = (0, useMemoizedFn_1.default)((index, items) => {
        const temp = [...list.value];
        items.forEach((_, i) => {
            setKey(index + i);
        });
        temp.splice(index, 0, ...items);
        list.value = temp;
    });
    const replace = (0, useMemoizedFn_1.default)((index, item) => {
        const temp = [...list.value];
        temp[index] = item;
        list.value = temp;
    });
    const remove = (0, useMemoizedFn_1.default)((index) => {
        const temp = [...list.value];
        temp.splice(index, 1);
        // remove keys if necessary
        try {
            keyList.value.splice(index, 1);
        }
        catch (e) {
            console.error(e);
        }
        list.value = temp;
    });
    const batchRemove = (0, useMemoizedFn_1.default)((indexes) => {
        if (!Array.isArray(indexes)) {
            if (process.env.NODE_ENV === 'development') {
                console.error(`\`indexes\` parameter of \`batchRemove\` function expected to be an array, but got "${typeof indexes}".`);
            }
            return;
        }
        if (!indexes.length) {
            return;
        }
        const newKeyList = [];
        const newList = list.value.filter((item, index) => {
            const shouldKeep = !indexes.includes(index);
            if (shouldKeep) {
                newKeyList.push(getKey(index));
            }
            return shouldKeep;
        });
        keyList.value = newKeyList;
        list.value = newList;
    });
    const move = (0, useMemoizedFn_1.default)((oldIndex, newIndex) => {
        if (oldIndex === newIndex) {
            return;
        }
        const newList = [...list.value];
        const temp = newList.filter((_, index) => index !== oldIndex);
        temp.splice(newIndex, 0, newList[oldIndex]);
        // move keys if necessary
        try {
            const keyTemp = keyList.value.filter((_, index) => index !== oldIndex);
            keyTemp.splice(newIndex, 0, keyList.value[oldIndex]);
            keyList.value = keyTemp;
        }
        catch (e) {
            console.error(e);
        }
        list.value = temp;
    });
    const push = (0, useMemoizedFn_1.default)((item) => {
        setKey(list.value.length);
        list.value = list.value.concat([item]);
    });
    const pop = (0, useMemoizedFn_1.default)(() => {
        // remove keys if necessary
        try {
            keyList.value = keyList.value.slice(0, keyList.value.length - 1);
        }
        catch (e) {
            console.error(e);
        }
        list.value = list.value.slice(0, list.value.length - 1);
    });
    const unshift = (0, useMemoizedFn_1.default)((item) => {
        setKey(0);
        list.value = [item].concat(list.value);
    });
    const shift = (0, useMemoizedFn_1.default)(() => {
        // remove keys if necessary
        try {
            keyList.value = keyList.value.slice(1, keyList.value.length);
        }
        catch (e) {
            console.error(e);
        }
        list.value = list.value.slice(1, list.value.length);
    });
    const sortList = (0, useMemoizedFn_1.default)((result) => result
        .map((item, index) => ({ key: index, item })) // add index into obj
        .sort((a, b) => getIndex(a.key) - getIndex(b.key)) // sort based on the index of table
        .filter((item) => !!item.item) // remove undefined(s)
        .map((item) => item.item));
    return {
        list,
        insert,
        merge,
        replace,
        remove,
        batchRemove,
        getKey,
        getIndex,
        move,
        push,
        pop,
        unshift,
        shift,
        sortList,
        resetList,
    };
};
exports.default = useDynamicList;
