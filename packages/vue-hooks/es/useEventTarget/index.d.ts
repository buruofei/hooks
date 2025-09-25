interface EventTarget<U> {
    target: {
        value: U;
    };
}
export interface Options<T, U> {
    initialValue?: T;
    transformer?: (value: U) => T;
}
declare function useEventTarget<T, U = T>(options?: Options<T, U>): readonly [[T] extends [import("vue").Ref<any, any>] ? import("@vue/shared").IfAny<T, import("vue").Ref<T, T>, T> : import("vue").Ref<import("vue").UnwrapRef<T>, T | import("vue").UnwrapRef<T>>, {
    readonly onChange: (this: unknown, e: EventTarget<U>) => void;
    readonly reset: (this: unknown) => void;
}];
export default useEventTarget;
