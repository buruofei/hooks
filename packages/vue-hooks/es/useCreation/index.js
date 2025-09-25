"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const depsAreSame_1 = __importDefault(require("../utils/depsAreSame"));
const useCreation = (factory, deps) => {
    const current = (0, vue_1.ref)({
        deps,
        obj: undefined,
        initialized: false,
    });
    if (current.value.initialized === false || !(0, depsAreSame_1.default)(current.value.deps, deps)) {
        current.value.deps = deps;
        current.value.obj = factory();
        current.value.initialized = true;
    }
    return current.value.obj;
};
exports.default = useCreation;