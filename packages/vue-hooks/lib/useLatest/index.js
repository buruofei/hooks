"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
function useLatest(value) {
    const latest = (0, vue_1.ref)(value);
    latest.value = value;
    return latest;
}
exports.default = useLatest;
