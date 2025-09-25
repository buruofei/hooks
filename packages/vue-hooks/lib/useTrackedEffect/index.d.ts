import { type WatchSource } from 'vue';
type Effect<T extends any[]> = (changes?: number[], previousDeps?: T, currentDeps?: T) => void | (() => void);
declare const useTrackedEffect: <T extends any[]>(effect: Effect<T>, deps?: WatchSource<T[number]>[]) => void;
export default useTrackedEffect;
