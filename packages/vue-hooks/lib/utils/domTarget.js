"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetElement = getTargetElement;
const index_1 = require("./index");
const vue_1 = require("vue");
function getTargetElement(target, defaultElement) {
    if (typeof window === 'undefined') {
        return undefined;
    }
    if (!target) {
        return defaultElement;
    }
    let targetElement;
    if ((0, index_1.isFunction)(target)) {
        targetElement = target();
    }
    else {
        targetElement = (0, vue_1.unref)(target);
    }
    return targetElement;
}
