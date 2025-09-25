"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useLatest_1 = __importDefault(require("../useLatest"));
const useMount_1 = __importDefault(require("../useMount"));
const utils_1 = require("../utils");
const domTarget_1 = require("../utils/domTarget");
const useDrag = (data, target, options = {}) => {
    const optionsRef = (0, useLatest_1.default)(options);
    const dataRef = (0, useLatest_1.default)(data);
    const imageElementRef = (0, vue_1.ref)();
    const { dragImage } = optionsRef.value;
    (0, useMount_1.default)(() => {
        if (dragImage?.image) {
            const { image } = dragImage;
            if ((0, utils_1.isString)(image)) {
                const imageElement = new Image();
                imageElement.src = image;
                imageElementRef.value = imageElement;
            }
            else {
                imageElementRef.value = image;
            }
        }
    });
    let cleanup = null;
    const setup = () => {
        if (cleanup) {
            cleanup();
        }
        const targetElement = (0, domTarget_1.getTargetElement)(target);
        if (!targetElement?.addEventListener) {
            return;
        }
        const onDragStart = (event) => {
            optionsRef.value.onDragStart?.(event);
            event.dataTransfer?.setData('custom', JSON.stringify(dataRef.value));
            if (dragImage?.image && imageElementRef.value) {
                const { offsetX = 0, offsetY = 0 } = dragImage;
                event.dataTransfer?.setDragImage(imageElementRef.value, offsetX, offsetY);
            }
        };
        const onDragEnd = (event) => {
            optionsRef.value.onDragEnd?.(event);
        };
        targetElement.setAttribute('draggable', 'true');
        targetElement.addEventListener('dragstart', onDragStart);
        targetElement.addEventListener('dragend', onDragEnd);
        cleanup = () => {
            targetElement.removeEventListener('dragstart', onDragStart);
            targetElement.removeEventListener('dragend', onDragEnd);
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
exports.default = useDrag;