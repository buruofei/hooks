"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useRequest_1 = __importDefault(require("../useRequest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useAntdTable = (service, options = {}) => {
    const { defaultPageSize = 10, defaultCurrent = 1, defaultType = 'simple', form, onSubmit, ...restOptions } = options;
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
    const searchType = (0, vue_1.ref)(defaultType);
    // Get current pagination params
    const current = (0, vue_1.computed)(() => result.params.value[0]?.current || defaultCurrent);
    const pageSize = (0, vue_1.computed)(() => result.params.value[0]?.pageSize || defaultPageSize);
    const total = (0, vue_1.computed)(() => result.data.value?.total || 0);
    // Table pagination handlers
    const onTableChange = (0, useMemoizedFn_1.default)((pagination, filters, sorter) => {
        const [oldParams = {}] = result.params.value || [];
        result.run({
            ...oldParams,
            current: pagination.current,
            pageSize: pagination.pageSize,
            filters,
            sorter,
        });
    });
    const onPaginationChange = (0, useMemoizedFn_1.default)((page, size) => {
        const [oldParams = {}] = result.params.value || [];
        result.run({
            ...oldParams,
            current: page,
            pageSize: size || pageSize.value,
        });
    });
    const onShowSizeChange = (0, useMemoizedFn_1.default)((current, size) => {
        onPaginationChange(current, size);
    });
    // Search form handlers
    const changeType = (0, useMemoizedFn_1.default)(() => {
        searchType.value = searchType.value === 'simple' ? 'advance' : 'simple';
    });
    const submit = (0, useMemoizedFn_1.default)(() => {
        const formData = form?.getFieldsValue?.() || {};
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
        form?.resetFields?.();
        const [oldParams = {}] = result.params.value || [];
        const params = {
            current: 1,
            pageSize: pageSize.value,
        };
        result.run(params);
    });
    // Table props for Ant Design Table component
    const tableProps = (0, vue_1.computed)(() => ({
        dataSource: result.data.value?.list || [],
        loading: result.loading.value,
        pagination: {
            current: current.value,
            pageSize: pageSize.value,
            total: total.value,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
            onChange: onPaginationChange,
            onShowSizeChange,
        },
        onChange: onTableChange,
    }));
    return {
        tableProps: tableProps.value,
        search: {
            type: searchType.value,
            changeType,
            submit,
            reset,
        },
        ...result,
    };
};
exports.default = useAntdTable;
