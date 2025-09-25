import { type Ref } from 'vue';
export interface Actions<T> {
    setLeft: () => void;
    setRight: () => void;
    set: (value: T) => void;
    toggle: () => void;
}
declare function useToggle<T = boolean>(): [Ref<boolean>, Actions<T>];
declare function useToggle<T>(defaultValue: T): [Ref<T>, Actions<T>];
declare function useToggle<T, U>(defaultValue: T, reverseValue: U): [Ref<T | U>, Actions<T | U>];
export default useToggle;
