"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useRequest_1 = __importDefault(require("../useRequest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useFusionTable = (service, options = {}) => {
    const { defaultPageSize = 10, defaultCurrent = 1, field, onSubmit, ...restOptions } = options;
    // Use useRequest for data fetching
    const result = (0, useRequest_1.default)(service, {
        defaultParams: [
            {
                current: defaultCurrent,
                pageSize: defaultPageSize,
            },
        ],
        ...restOptions,
    });
    // Get current pagination params
    const current = (0, vue_1.computed)(() => result.params.value[0]?.current || defaultCurrent);
    const pageSize = (0, vue_1.computed)(() => result.params.value[0]?.pageSize || defaultPageSize);
    const total = (0, vue_1.computed)(() => result.data.value?.total || 0);
    // Pagination handlers
    const onPaginationChange = (0, useMemoizedFn_1.default)((page) => {
        const [oldParams = {}] = result.params.value || [];
        result.run({
            ...oldParams,
            current: page,
        });
    });
    const onPageSizeChange = (0, useMemoizedFn_1.default)((size) => {
        const [oldParams = {}] = result.params.value || [];
        result.run({
            ...oldParams,
            current: 1, // Reset to first page when page size changes
            pageSize: size,
        });
    });
    // Search form handlers
    const submit = (0, useMemoizedFn_1.default)(() => {
        const formData = field?.getValues?.() || {};
        const [oldParams = {}] = result.params.value || [];
        const params = {
            ...oldParams,
            ...formData,
            current: 1, // Reset to first page when searching
        };
        onSubmit?.(params);
        result.run(params);
    });
    const reset = (0, useMemoizedFn_1.default)(() => {
        field?.reset?.();
        const [oldParams = {}] = result.params.value || [];
        const params = {
            current: 1,
            pageSize: pageSize.value,
        };
        result.run(params);
    });
    // Table props for Fusion Table component
    const tableProps = (0, vue_1.computed)(() => ({
        dataSource: result.data.value?.list || [],
        loading: result.loading.value,
    }));
    // Pagination props for Fusion Pagination component
    const paginationProps = (0, vue_1.computed)(() => ({
        current: current.value,
        pageSize: pageSize.value,
        total: total.value,
        onChange: onPaginationChange,
        onPageSizeChange,
        showJump: true,
        showSizeSelector: true,
    }));
    return {
        tableProps: tableProps.value,
        paginationProps: paginationProps.value,
        search: {
            submit,
            reset,
        },
        ...result,
    };
};
exports.default = useFusionTable;
