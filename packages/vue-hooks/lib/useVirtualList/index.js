"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useEventListener_1 = __importDefault(require("../useEventListener"));
const useLatest_1 = __importDefault(require("../useLatest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useSize_1 = __importDefault(require("../useSize"));
const domTarget_1 = require("../utils/domTarget");
const utils_1 = require("../utils");
const useVirtualList = (list, options) => {
    const { containerTarget, wrapperTarget, itemHeight, overscan = 5 } = options;
    const itemHeightRef = (0, useLatest_1.default)(itemHeight);
    const size = (0, useSize_1.default)(containerTarget);
    const scrollTriggerByScrollToFunc = (0, vue_1.ref)(false);
    const targetList = (0, vue_1.ref)([]);
    const wrapperStyle = (0, vue_1.ref)({});
    const getVisibleCount = (containerHeight, fromIndex) => {
        if ((0, utils_1.isNumber)(itemHeightRef.value)) {
            return Math.ceil(containerHeight / itemHeightRef.value);
        }
        let sum = 0;
        let endIndex = 0;
        for (let i = fromIndex; i < list.length; i++) {
            const height = itemHeightRef.value(i, list[i]);
            sum += height;
            endIndex = i;
            if (sum >= containerHeight) {
                break;
            }
        }
        return endIndex - fromIndex;
    };
    const getOffset = (scrollTop) => {
        if ((0, utils_1.isNumber)(itemHeightRef.value)) {
            return Math.floor(scrollTop / itemHeightRef.value);
        }
        let sum = 0;
        let offset = 0;
        for (let i = 0; i < list.length; i++) {
            const height = itemHeightRef.value(i, list[i]);
            sum += height;
            if (sum >= scrollTop) {
                offset = i;
                break;
            }
        }
        return offset + 1;
    };
    // 获取上部高度
    const getDistanceTop = (index) => {
        if ((0, utils_1.isNumber)(itemHeightRef.value)) {
            const height = index * itemHeightRef.value;
            return height;
        }
        const height = list
            .slice(0, index)
            .reduce((sum, _, i) => sum + itemHeightRef.value(i, list[i]), 0);
        return height;
    };
    const totalHeight = (0, vue_1.computed)(() => {
        if ((0, utils_1.isNumber)(itemHeightRef.value)) {
            return list.length * itemHeightRef.value;
        }
        return list.reduce((sum, _, index) => sum + itemHeightRef.value(index, list[index]), 0);
    });
    const calculateRange = () => {
        const container = (0, domTarget_1.getTargetElement)(containerTarget);
        if (container) {
            const { scrollTop, clientHeight } = container;
            const offset = getOffset(scrollTop);
            const visibleCount = getVisibleCount(clientHeight, offset);
            const start = Math.max(0, offset - overscan);
            const end = Math.min(list.length, offset + visibleCount + overscan);
            const offsetTop = getDistanceTop(start);
            wrapperStyle.value = {
                height: totalHeight.value - offsetTop + 'px',
                marginTop: offsetTop + 'px',
            };
            targetList.value = list.slice(start, end).map((ele, index) => ({
                data: ele,
                index: index + start,
            }));
        }
    };
    // Apply wrapper style when it changes
    (0, vue_1.watch)(() => wrapperStyle.value, (newStyle) => {
        const wrapper = (0, domTarget_1.getTargetElement)(wrapperTarget);
        if (wrapper) {
            Object.keys(newStyle).forEach((key) => {
                wrapper.style[key] = newStyle[key];
            });
        }
    }, { deep: true });
    // Recalculate when size or list changes
    (0, vue_1.watch)(() => [size.value?.width, size.value?.height, list], () => {
        if (!size.value?.width || !size.value?.height) {
            return;
        }
        calculateRange();
    }, { deep: true });
    (0, useEventListener_1.default)('scroll', (e) => {
        if (scrollTriggerByScrollToFunc.value) {
            scrollTriggerByScrollToFunc.value = false;
            return;
        }
        e.preventDefault();
        calculateRange();
    }, {
        target: containerTarget,
    });
    const scrollTo = (0, useMemoizedFn_1.default)((index) => {
        const container = (0, domTarget_1.getTargetElement)(containerTarget);
        if (container) {
            scrollTriggerByScrollToFunc.value = true;
            container.scrollTop = getDistanceTop(index);
            calculateRange();
        }
    });
    return [targetList, scrollTo];
};
exports.default = useVirtualList;
