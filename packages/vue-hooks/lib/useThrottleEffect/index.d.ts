import { type WatchSource, type WatchCallback } from 'vue';
import type { ThrottleOptions } from '../utils/lodash-polyfill';
declare function useThrottleEffect<T = any>(effect: WatchCallback<T, T | undefined>, deps: WatchSource<T> | WatchSource<T>[], options?: ThrottleOptions): void;
export default useThrottleEffect;
