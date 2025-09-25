import { type Ref } from 'vue';
import type { BasicTarget } from '../utils/domTarget';
type ItemHeight<T> = (index: number, data: T) => number;
export interface Options<T> {
    containerTarget: BasicTarget;
    wrapperTarget: BasicTarget;
    itemHeight: number | ItemHeight<T>;
    overscan?: number;
}
declare const useVirtualList: <T = any>(list: T[], options: Options<T>) => readonly [Ref<{
    index: number;
    data: import("vue").UnwrapRef<T>;
}[], {
    index: number;
    data: T;
}[] | {
    index: number;
    data: import("vue").UnwrapRef<T>;
}[]>, (this: unknown, index: number) => void];
export default useVirtualList;
