"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
function useLockFn(fn) {
    const lockRef = (0, vue_1.ref)(false);
    return (0, useMemoizedFn_1.default)(async (...args) => {
        if (lockRef.value) {
            return;
        }
        lockRef.value = true;
        try {
            const ret = await fn(...args);
            return ret;
        }
        catch (e) {
            throw e;
        }
        finally {
            lockRef.value = false;
        }
    });
}
exports.default = useLockFn;
