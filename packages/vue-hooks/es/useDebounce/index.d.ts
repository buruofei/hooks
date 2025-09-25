import { type Ref } from 'vue';
import type { DebounceOptions } from '../utils/lodash-polyfill';
declare function useDebounce<T>(value: T, options?: DebounceOptions): Ref<T>;
export default useDebounce;
