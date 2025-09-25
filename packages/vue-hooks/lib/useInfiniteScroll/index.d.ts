import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    threshold?: number;
    rootMargin?: string;
    reloadDeps?: any[];
    manual?: boolean;
    onBefore?: () => void;
}
export interface Result {
    data: any;
    loading: boolean;
    loadingMore: boolean;
    error?: Error;
    loadMore: () => void;
    loadMoreAsync: () => Promise<any>;
    reload: () => void;
    reloadAsync: () => Promise<any>;
    cancel: () => void;
    mutate: (data?: any) => void;
    scrollMethod: () => void;
}
declare const useInfiniteScroll: <TData = any>(service: (currentData?: TData) => Promise<TData>, options: Options & {
    target: BasicTarget;
    isNoMore?: (data?: TData) => boolean;
}) => Result;
export default useInfiniteScroll;
