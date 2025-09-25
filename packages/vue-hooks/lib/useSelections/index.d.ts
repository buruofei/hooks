import { type Ref } from 'vue';
export interface Options<T> {
    defaultSelected?: T[];
    itemKey?: string | ((item: T) => string | number);
}
declare function useSelections<T>(items: T[], options?: T[] | Options<T>): {
    readonly selected: Ref<import("@vue/reactivity").UnwrapRefSimple<T>[], T[] | import("@vue/reactivity").UnwrapRefSimple<T>[]>;
    readonly noneSelected: import("vue").ComputedRef<boolean>;
    readonly allSelected: import("vue").ComputedRef<boolean>;
    readonly partiallySelected: import("vue").ComputedRef<boolean>;
    readonly setSelected: (this: unknown, newSelected: T[]) => void;
    readonly isSelected: (this: unknown, item: T) => boolean;
    readonly select: (this: unknown, item: T) => void;
    readonly unSelect: (this: unknown, item: T) => void;
    readonly toggle: (this: unknown, item: T) => void;
    readonly selectAll: (this: unknown) => void;
    readonly unSelectAll: (this: unknown) => void;
    readonly clearAll: (this: unknown) => void;
    readonly toggleAll: (this: unknown) => void;
};
export default useSelections;
