import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    onChange?: (isFocusWithin: boolean) => void;
}
declare function useFocusWithin(target: BasicTarget, options?: Options): import("vue").Ref<boolean, boolean>;
export default useFocusWithin;
