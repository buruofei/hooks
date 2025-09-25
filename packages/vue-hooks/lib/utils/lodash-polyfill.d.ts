export interface DebounceOptions {
    wait?: number;
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
}
export interface ThrottleOptions {
    wait?: number;
    leading?: boolean;
    trailing?: boolean;
}
interface DebouncedFunc<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel(): void;
    flush(): ReturnType<T> | undefined;
}
interface ThrottledFunc<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel(): void;
    flush(): ReturnType<T> | undefined;
}
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait?: number, options?: DebounceOptions): DebouncedFunc<T>;
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait?: number, options?: ThrottleOptions): ThrottledFunc<T>;
export {};
