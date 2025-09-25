"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const domTarget_1 = require("../utils/domTarget");
const useDrop = (target, options = {}) => {
    const optionsRef = (0, useLatest_1.default)(options);
    // https://stackoverflow.com/a/26459269
    const dragEnterTarget = (0, vue_1.ref)();
    let cleanup = null;
    const setup = () => {
        if (cleanup) {
            cleanup();
        }
        const targetElement = (0, domTarget_1.getTargetElement)(target);
        if (!targetElement?.addEventListener) {
            return;
        }
        const onData = (dataTransfer, event) => {
            const uri = dataTransfer.getData('text/uri-list');
            const dom = dataTransfer.getData('custom');
            if (dom && optionsRef.value.onDom) {
                let data = dom;
                try {
                    data = JSON.parse(dom);
                }
                catch {
                    data = dom;
                }
                optionsRef.value.onDom(data, event);
                return;
            }
            if (uri && optionsRef.value.onUri) {
                optionsRef.value.onUri(uri, event);
                return;
            }
            if (dataTransfer.files && dataTransfer.files.length && optionsRef.value.onFiles) {
                optionsRef.value.onFiles(Array.from(dataTransfer.files), event);
                return;
            }
            if (dataTransfer.items && dataTransfer.items.length && optionsRef.value.onText) {
                dataTransfer.items[0].getAsString((text) => {
                    optionsRef.value.onText(text, event);
                });
            }
        };
        const onDragEnter = (event) => {
            event.preventDefault();
            event.stopPropagation();
            dragEnterTarget.value = event.target;
            optionsRef.value.onDragEnter?.(event);
        };
        const onDragOver = (event) => {
            event.preventDefault();
            optionsRef.value.onDragOver?.(event);
        };
        const onDragLeave = (event) => {
            if (event.target === dragEnterTarget.value) {
                optionsRef.value.onDragLeave?.(event);
            }
        };
        const onDrop = (event) => {
            event.preventDefault();
            if (event.dataTransfer) {
                onData(event.dataTransfer, event);
            }
            optionsRef.value.onDrop?.(event);
        };
        const onPaste = (event) => {
            if (event.clipboardData) {
                onData(event.clipboardData, event);
            }
            optionsRef.value.onPaste?.(event);
        };
        targetElement.addEventListener('dragenter', onDragEnter);
        targetElement.addEventListener('dragover', onDragOver);
        targetElement.addEventListener('dragleave', onDragLeave);
        targetElement.addEventListener('drop', onDrop);
        targetElement.addEventListener('paste', onPaste);
        cleanup = () => {
            targetElement.removeEventListener('dragenter', onDragEnter);
            targetElement.removeEventListener('dragover', onDragOver);
            targetElement.removeEventListener('dragleave', onDragLeave);
            targetElement.removeEventListener('drop', onDrop);
            targetElement.removeEventListener('paste', onPaste);
        };
    };
    (0, vue_1.watch)(() => target, () => {
        setup();
    }, { immediate: true, deep: true });
    (0, vue_1.onUnmounted)(() => {
        if (cleanup) {
            cleanup();
        }
    });
};
exports.default = useDrop;
