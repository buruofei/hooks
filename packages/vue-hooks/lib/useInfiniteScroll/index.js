"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const domTarget_1 = require("../utils/domTarget");
const useLatest_1 = __importDefault(require("../useLatest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const useInfiniteScroll = (service, options) => {
    const { target, isNoMore, threshold = 100, rootMargin = '0px', reloadDeps = [], manual, onBefore, } = options;
    const data = (0, vue_1.ref)();
    const loading = (0, vue_1.ref)(false);
    const loadingMore = (0, vue_1.ref)(false);
    const error = (0, vue_1.ref)();
    const serviceRef = (0, useLatest_1.default)(service);
    const isNoMoreRef = (0, useLatest_1.default)(isNoMore);
    let cleanup = null;
    const loadData = (0, useMemoizedFn_1.default)(async (isLoadMore = false) => {
        if (loading.value || loadingMore.value) {
            return;
        }
        onBefore?.();
        try {
            if (isLoadMore) {
                loadingMore.value = true;
            }
            else {
                loading.value = true;
            }
            const result = await serviceRef.value(isLoadMore ? data.value : undefined);
            if (isLoadMore) {
                // Merge data logic should be implemented based on your data structure
                data.value = result;
            }
            else {
                data.value = result;
            }
            error.value = undefined;
        }
        catch (e) {
            error.value = e;
        }
        finally {
            loading.value = false;
            loadingMore.value = false;
        }
    });
    const loadMore = (0, useMemoizedFn_1.default)(() => {
        if (isNoMoreRef.value?.(data.value)) {
            return;
        }
        loadData(true);
    });
    const loadMoreAsync = (0, useMemoizedFn_1.default)(() => {
        return loadData(true);
    });
    const reload = (0, useMemoizedFn_1.default)(() => {
        loadData(false);
    });
    const reloadAsync = (0, useMemoizedFn_1.default)(() => {
        return loadData(false);
    });
    const cancel = (0, useMemoizedFn_1.default)(() => {
        loading.value = false;
        loadingMore.value = false;
    });
    const mutate = (0, useMemoizedFn_1.default)((newData) => {
        if (newData !== undefined) {
            data.value = newData;
        }
    });
    const scrollMethod = (0, useMemoizedFn_1.default)(() => {
        const el = (0, domTarget_1.getTargetElement)(target);
        if (!el)
            return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollHeight - scrollTop - clientHeight <= threshold) {
            loadMore();
        }
    });
    const setupScrollListener = () => {
        if (cleanup) {
            cleanup();
        }
        const el = (0, domTarget_1.getTargetElement)(target);
        if (!el)
            return;
        el.addEventListener('scroll', scrollMethod);
        cleanup = () => {
            el.removeEventListener('scroll', scrollMethod);
        };
    };
    (0, vue_1.watch)(() => target, () => {
        setupScrollListener();
    }, { immediate: true, deep: true });
    (0, vue_1.watch)(() => reloadDeps, () => {
        reload();
    }, { deep: true });
    // Initial load
    if (!manual) {
        (0, vue_1.nextTick)(() => {
            reload();
        });
    }
    (0, vue_1.onUnmounted)(() => {
        if (cleanup) {
            cleanup();
        }
    });
    return {
        data: data.value,
        loading: loading.value,
        loadingMore: loadingMore.value,
        error: error.value,
        loadMore,
        loadMoreAsync,
        reload,
        reloadAsync,
        cancel,
        mutate,
        scrollMethod,
    };
};
exports.default = useInfiniteScroll;
