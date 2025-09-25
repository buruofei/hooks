"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useUpdate = () => {
    const count = (0, vue_1.ref)(0);
    return () => {
        count.value += 1;
    };
};
exports.default = useUpdate;
