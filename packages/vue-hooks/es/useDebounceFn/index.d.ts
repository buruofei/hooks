import { type DebounceOptions } from '../utils/lodash-polyfill';
type noop = (...args: any[]) => any;
declare function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions): {
    run: import("../utils/lodash-polyfill").DebouncedFunc<(...args: Parameters<T>) => ReturnType<T>>;
    cancel: () => void;
    flush: () => ReturnType<T>;
};
export default useDebounceFn;
