"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useRequest_1 = __importDefault(require("../useRequest"));
const usePagination = (service, options = {}) => {
    const { defaultPageSize = 10, defaultCurrent = 1, ...rest } = options;
    const result = (0, useRequest_1.default)(service, {
        defaultParams: [{ current: defaultCurrent, pageSize: defaultPageSize }],
        refreshDepsAction: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            changeCurrent(1);
        },
        ...rest,
    });
    const { current = 1, pageSize = defaultPageSize } = result.params.value[0] || {};
    const total = (0, vue_1.computed)(() => result.data.value?.total || 0);
    const totalPage = (0, vue_1.computed)(() => Math.ceil(total.value / pageSize));
    const onChange = (c, p) => {
        let toCurrent = c <= 0 ? 1 : c;
        const toPageSize = p <= 0 ? 1 : p;
        const tempTotalPage = Math.ceil(total.value / toPageSize);
        if (toCurrent > tempTotalPage) {
            toCurrent = Math.max(1, tempTotalPage);
        }
        const [oldPaginationParams = {}, ...restParams] = result.params.value || [];
        result.run({
            ...oldPaginationParams,
            current: toCurrent,
            pageSize: toPageSize,
        }, ...restParams);
    };
    const changeCurrent = (c) => {
        onChange(c, pageSize);
    };
    const changePageSize = (p) => {
        onChange(current, p);
    };
    return {
        ...result,
        pagination: {
            current,
            pageSize,
            total,
            totalPage,
            onChange: (0, useMemoizedFn_1.default)(onChange),
            changeCurrent: (0, useMemoizedFn_1.default)(changeCurrent),
            changePageSize: (0, useMemoizedFn_1.default)(changePageSize),
        },
    };
};
exports.default = usePagination;