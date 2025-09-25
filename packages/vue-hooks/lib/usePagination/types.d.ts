import type { Ref } from 'vue';
export type Data = {
    total: number;
    list: any[];
};
export type Params = [{
    current: number;
    pageSize: number;
}, ...any[]];
export type Service<TData, TParams> = (...args: TParams) => Promise<TData>;
export interface PaginationOptions<TData, TParams> {
    defaultPageSize?: number;
    defaultCurrent?: number;
    refreshDepsAction?: () => void;
    [key: string]: any;
}
export interface PaginationResult<TData, TParams> {
    data: Ref<TData | undefined>;
    loading: Ref<boolean>;
    params: Ref<TParams>;
    error: Ref<Error | undefined>;
    run: (...params: TParams) => void;
    pagination: {
        current: number;
        pageSize: number;
        total: Ref<number>;
        totalPage: Ref<number>;
        onChange: (current: number, pageSize: number) => void;
        changeCurrent: (current: number) => void;
        changePageSize: (pageSize: number) => void;
    };
}
