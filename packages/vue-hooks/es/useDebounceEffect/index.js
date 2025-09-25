"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useDebounceFn_1 = __importDefault(require("../useDebounceFn"));
const useUpdateEffect_1 = __importDefault(require("../useUpdateEffect"));
function useDebounceEffect(effect, deps, options) {
    const flag = (0, vue_1.ref)({});
    const { run } = (0, useDebounceFn_1.default)(() => {
        flag.value = {};
    }, options);
    (0, vue_1.watch)(deps, () => {
        run();
    });
    (0, useUpdateEffect_1.default)(effect, flag);
}
exports.default = useDebounceEffect;