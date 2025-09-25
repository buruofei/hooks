"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
const useMount = (fn) => {
    if (process.env.NODE_ENV === 'development') {
        if (!(0, utils_1.isFunction)(fn)) {
            console.error(`useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`);
        }
    }
    (0, vue_1.onMounted)(() => {
        return fn?.();
    });
};
exports.default = useMount;