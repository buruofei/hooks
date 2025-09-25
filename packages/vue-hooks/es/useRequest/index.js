"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useLatest_1 = __importDefault(require("../useLatest"));
function useRequest(service, options = {}) {
    const { manual = false, defaultParams = [], refreshDeps = [], refreshDepsAction, onBefore, onSuccess, onError, onFinally, formatResult, ready = true, } = options;
    const data = (0, vue_1.ref)();
    const error = (0, vue_1.ref)();
    const loading = (0, vue_1.ref)(false);
    const params = (0, vue_1.ref)(defaultParams);
    const serviceRef = (0, useLatest_1.default)(service);
    let requestIdRef = 0;
    const execute = (0, useMemoizedFn_1.default)(async (...args) => {
        if (!ready) {
            throw new Error('Request is not ready');
        }
        const currentRequestId = ++requestIdRef;
        params.value = args;
        loading.value = true;
        error.value = undefined;
        onBefore?.(args);
        try {
            const result = await serviceRef.value(...args);
            // Check if this is still the latest request
            if (currentRequestId === requestIdRef) {
                const formattedResult = formatResult ? formatResult(result) : result;
                data.value = formattedResult;
                onSuccess?.(formattedResult, args);
                return formattedResult;
            }
            return result;
        }
        catch (e) {
            if (currentRequestId === requestIdRef) {
                const errorObj = e;
                error.value = errorObj;
                onError?.(errorObj, args);
                throw errorObj;
            }
            throw e;
        }
        finally {
            if (currentRequestId === requestIdRef) {
                loading.value = false;
                onFinally?.(args, data.value, error.value);
            }
        }
    });
    const run = (0, useMemoizedFn_1.default)((...args) => {
        execute(...args).catch(() => {
            // Error already handled in execute
        });
    });
    const runAsync = (0, useMemoizedFn_1.default)((...args) => {
        return execute(...args);
    });
    const refresh = (0, useMemoizedFn_1.default)(() => {
        run(...params.value);
    });
    const refreshAsync = (0, useMemoizedFn_1.default)(() => {
        return runAsync(...params.value);
    });
    const mutate = (0, useMemoizedFn_1.default)((newData) => {
        if (typeof newData === 'function') {
            data.value = newData(data.value);
        }
        else {
            data.value = newData;
        }
    });
    const cancel = (0, useMemoizedFn_1.default)(() => {
        requestIdRef++;
        loading.value = false;
    });
    // Watch refresh dependencies
    (0, vue_1.watch)(() => refreshDeps, () => {
        if (refreshDepsAction) {
            refreshDepsAction();
        }
        else if (!manual) {
            refresh();
        }
    }, { deep: true });
    // Initial execution
    if (!manual) {
        (0, vue_1.nextTick)(() => {
            run(...params.value);
        });
    }
    (0, vue_1.onUnmounted)(() => {
        cancel();
    });
    return {
        data,
        error,
        loading,
        params,
        run,
        runAsync,
        refresh,
        refreshAsync,
        mutate,
        cancel,
    };
}
exports.default = useRequest;