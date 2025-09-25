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
    defaultType?: 'simple' | 'advance';
    form?: any;
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
        pagination: {
            current: number;
            pageSize: number;
            total: number;
            showSizeChanger: boolean;
            showQuickJumper: boolean;
            showTotal: (total: number, range: [number, number]) => string;
            onChange: (page: number, pageSize?: number) => void;
            onShowSizeChange: (current: number, size: number) => void;
        };
        onChange: (pagination: any, filters: any, sorter: any) => void;
    };
    search: {
        type: 'simple' | 'advance';
        changeType: () => void;
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
declare const useAntdTable: <TData extends Data = Data, TParams extends Params = Params>(service: (...args: any[]) => Promise<TData>, options?: Options<TData, TParams>) => Result<TData, TParams>;
export default useAntdTable;
