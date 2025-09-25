"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useHistoryTravel;
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const utils_1 = require("../utils");
const dumpIndex = (step, arr) => {
    let index = step > 0
        ? step - 1 // move forward
        : arr.length + step; // move backward
    if (index >= arr.length - 1) {
        index = arr.length - 1;
    }
    if (index < 0) {
        index = 0;
    }
    return index;
};
const split = (step, targetArr) => {
    const index = dumpIndex(step, targetArr);
    return {
        _current: targetArr[index],
        _before: targetArr.slice(0, index),
        _after: targetArr.slice(index + 1),
    };
};
function useHistoryTravel(initialValue, maxLength = 0) {
    const history = (0, vue_1.ref)({
        present: initialValue,
        past: [],
        future: [],
    });
    const present = (0, vue_1.computed)(() => history.value.present);
    const past = (0, vue_1.computed)(() => history.value.past);
    const future = (0, vue_1.computed)(() => history.value.future);
    const initialValueRef = (0, vue_1.ref)(initialValue);
    const reset = (0, useMemoizedFn_1.default)((...params) => {
        const _initial = params.length > 0 ? params[0] : initialValueRef.value;
        initialValueRef.value = _initial;
        history.value = {
            present: _initial,
            future: [],
            past: [],
        };
    });
    const updateValue = (0, useMemoizedFn_1.default)((val) => {
        const _past = [...past.value, present.value];
        const maxLengthNum = (0, utils_1.isNumber)(maxLength) ? maxLength : Number(maxLength);
        // maximum number of records exceeded
        if (maxLengthNum > 0 && _past.length > maxLengthNum) {
            //delete first
            _past.splice(0, 1);
        }
        history.value = {
            present: val,
            future: [],
            past: _past,
        };
    });
    const _forward = (step = 1) => {
        if (future.value.length === 0) {
            return;
        }
        const { _before, _current, _after } = split(step, future.value);
        history.value = {
            past: [...past.value, present.value, ..._before],
            present: _current,
            future: _after,
        };
    };
    const _backward = (step = -1) => {
        if (past.value.length === 0) {
            return;
        }
        const { _before, _current, _after } = split(step, past.value);
        history.value = {
            past: _before,
            present: _current,
            future: [..._after, present.value, ...future.value],
        };
    };
    const go = (0, useMemoizedFn_1.default)((step) => {
        const stepNum = (0, utils_1.isNumber)(step) ? step : Number(step);
        if (stepNum === 0) {
            return;
        }
        if (stepNum > 0) {
            return _forward(stepNum);
        }
        _backward(stepNum);
    });
    return {
        value: present,
        backLength: (0, vue_1.computed)(() => past.value.length),
        forwardLength: (0, vue_1.computed)(() => future.value.length),
        setValue: updateValue,
        go,
        back: (0, useMemoizedFn_1.default)(() => {
            go(-1);
        }),
        forward: (0, useMemoizedFn_1.default)(() => {
            go(1);
        }),
        reset,
    };
}