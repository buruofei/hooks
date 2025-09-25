"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getDocumentOrShadow;
const domTarget_1 = require("./domTarget");
function getDocumentOrShadow(target) {
    const targetElement = Array.isArray(target)
        ? (0, domTarget_1.getTargetElement)(target[0])
        : (0, domTarget_1.getTargetElement)(target);
    if (!targetElement) {
        return document;
    }
    const rootNode = targetElement.getRootNode?.();
    if (rootNode && 'querySelector' in rootNode) {
        return rootNode;
    }
    return document;
}
