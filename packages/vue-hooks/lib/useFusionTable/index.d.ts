import { type Ref } from 'vue';
export interface Data {
    total: number;
    list: any[];
}
export interface Params {
    current: number;
    pageSize: number;
    sorter?: any;
    filters?: any;
    [key: string]: any;
}
export interface Options<TData, TParams> {
    defaultPageSize?: number;
    defaultCurrent?: number;
    field?: any;
    onSubmit?: (params: TParams) => void;
    manual?: boolean;
    ready?: boolean;
    defaultParams?: TParams[];
    refreshDeps?: any[];
    [key: string]: any;
}
export interface Result<TData, TParams> {
    tableProps: {
        dataSource: any[];
        loading: boolean;
    };
    paginationProps: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (current: number) => void;
        onPageSizeChange: (pageSize: number) => void;
        showJump: boolean;
        showSizeSelector: boolean;
    };
    search: {
        submit: () => void;
        reset: () => void;
    };
    data: Ref<TData | undefined>;
    error: Ref<Error | undefined>;
    loading: Ref<boolean>;
    params: Ref<TParams[]>;
    run: (...params: TParams[]) => void;
    refresh: () => void;
    mutate: (data?: TData) => void;
    cancel: () => void;
}
declare const useFusionTable: <TData extends Data = Data, TParams extends Params = Params>(service: (...args: any[]) => Promise<TData>, options?: Options<TData, TParams>) => Result<TData, TParams>;
export default useFusionTable;
