import { type Ref } from 'vue';
declare function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>): (Ref<Map<K, import("@vue/reactivity").UnwrapRefSimple<T>> & Omit<Map<K, T>, keyof Map<any, any>>, Map<K, T> | (Map<K, import("@vue/reactivity").UnwrapRefSimple<T>> & Omit<Map<K, T>, keyof Map<any, any>>)> | {
    set: (this: unknown, key: K, entry: T) => void;
    setAll: (this: unknown, newMap: Iterable<readonly [K, T]>) => void;
    remove: (this: unknown, key: K) => void;
    reset: (this: unknown) => void;
    get: (this: unknown, key: K) => import("@vue/reactivity").UnwrapRefSimple<T>;
})[];
export default useMap;
