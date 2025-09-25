import { type ThrottleOptions } from '../utils/lodash-polyfill';
type noop = (...args: any[]) => any;
declare function useThrottleFn<T extends noop>(fn: T, options?: ThrottleOptions): {
    run: import("../utils/lodash-polyfill").ThrottledFunc<(...args: Parameters<T>) => ReturnType<T>>;
    cancel: () => void;
    flush: () => ReturnType<T>;
};
export default useThrottleFn;
