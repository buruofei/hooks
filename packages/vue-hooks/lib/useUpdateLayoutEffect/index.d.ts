import { type WatchSource, type WatchCallback, type WatchOptions } from 'vue';
declare function useUpdateLayoutEffect<T = any>(effect: WatchCallback<T, T | undefined>, deps: WatchSource<T> | WatchSource<T>[], options?: WatchOptions): void;
export default useUpdateLayoutEffect;
