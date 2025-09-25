"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useEventListener_1 = __importDefault(require("../useEventListener"));
const isBrowser_1 = __importDefault(require("../utils/isBrowser"));
const getVisibility = () => {
    if (!isBrowser_1.default) {
        return 'visible';
    }
    return document.visibilityState;
};
function useDocumentVisibility() {
    const documentVisibility = (0, vue_1.ref)(getVisibility());
    (0, useEventListener_1.default)('visibilitychange', () => {
        documentVisibility.value = getVisibility();
    }, {
        target: () => document,
    });
    return documentVisibility;
}
exports.default = useDocumentVisibility;