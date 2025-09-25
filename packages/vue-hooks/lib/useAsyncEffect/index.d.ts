import { type WatchSource } from 'vue';
declare function useAsyncEffect(effect: () => AsyncGenerator<void, void, void> | Promise<void>, deps?: WatchSource | WatchSource[]): void;
export default useAsyncEffect;
