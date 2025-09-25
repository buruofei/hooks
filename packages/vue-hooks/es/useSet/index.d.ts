import { type Ref } from 'vue';
declare function useSet<K>(initialValue?: Iterable<K>): (Ref<Set<import("@vue/reactivity").UnwrapRefSimple<K>> & Omit<Set<K>, keyof Set<any>>, Set<K> | (Set<import("@vue/reactivity").UnwrapRefSimple<K>> & Omit<Set<K>, keyof Set<any>>)> | {
    add: (this: unknown, key: K) => void;
    remove: (this: unknown, key: K) => void;
    reset: (this: unknown) => void;
})[];
export default useSet;
