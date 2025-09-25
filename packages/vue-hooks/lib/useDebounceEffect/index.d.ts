import { type WatchSource, type WatchCallback } from 'vue';
import type { DebounceOptions } from '../utils/lodash-polyfill';
declare function useDebounceEffect<T = any>(effect: WatchCallback<T, T | undefined>, deps: WatchSource<T> | WatchSource<T>[], options?: DebounceOptions): void;
export default useDebounceEffect;
