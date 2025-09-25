declare const useDynamicList: <T>(initialList?: T[]) => {
    list: import("vue").Ref<import("@vue/reactivity").UnwrapRefSimple<T>[], T[] | import("@vue/reactivity").UnwrapRefSimple<T>[]>;
    insert: (this: unknown, index: number, item: T) => void;
    merge: (this: unknown, index: number, items: T[]) => void;
    replace: (this: unknown, index: number, item: T) => void;
    remove: (this: unknown, index: number) => void;
    batchRemove: (this: unknown, indexes: number[]) => void;
    getKey: (this: unknown, index: number) => number;
    getIndex: (this: unknown, key: number) => number;
    move: (this: unknown, oldIndex: number, newIndex: number) => void;
    push: (this: unknown, item: T) => void;
    pop: (this: unknown) => void;
    unshift: (this: unknown, item: T) => void;
    shift: (this: unknown) => void;
    sortList: (this: unknown, result: T[]) => T[];
    resetList: (this: unknown, newList: T[]) => void;
};
export default useDynamicList;
