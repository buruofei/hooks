export interface Options<TData, TParams extends any[]> {
    manual?: boolean;
    defaultParams?: TParams;
    refreshDeps?: any[];
    refreshDepsAction?: () => void;
    loadingDelay?: number;
    pollingInterval?: number;
    pollingWhenHidden?: boolean;
    pollingErrorRetryCount?: number;
    debounceWait?: number;
    debounceLeading?: boolean;
    debounceTrailing?: boolean;
    debounceMaxWait?: number;
    throttleWait?: number;
    throttleLeading?: boolean;
    throttleTrailing?: boolean;
    cacheKey?: string;
    cacheTime?: number;
    staleTime?: number;
    retryCount?: number;
    retryInterval?: number;
    onBefore?: (params: TParams) => void;
    onSuccess?: (data: TData, params: TParams) => void;
    onError?: (e: Error, params: TParams) => void;
    onFinally?: (params: TParams, data?: TData, e?: Error) => void;
    formatResult?: (res: any) => TData;
    ready?: boolean;
}
export interface Result<TData, TParams extends any[]> {
    data: any;
    error: any;
    loading: any;
    params: any;
    run: (...params: TParams) => void;
    runAsync: (...params: TParams) => Promise<TData>;
    refresh: () => void;
    refreshAsync: () => Promise<TData>;
    mutate: (data?: TData | ((oldData?: TData) => TData)) => void;
    cancel: () => void;
}
declare function useRequest<TData = any, TParams extends any[] = any[]>(service: (...args: TParams) => Promise<TData>, options?: Options<TData, TParams>): Result<TData, TParams>;
export default useRequest;
