import { type Ref } from 'vue';
import type { ThrottleOptions } from '../utils/lodash-polyfill';
declare function useThrottle<T>(value: T, options?: ThrottleOptions): Ref<T>;
export default useThrottle;
