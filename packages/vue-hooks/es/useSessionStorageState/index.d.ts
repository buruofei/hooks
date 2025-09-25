declare const useSessionStorageState: <T>(key: string, options?: import("../createUseStorageState").Options<T>) => [import("vue").Ref<T | undefined>, (value: import("../createUseStorageState").SetState<T>) => void];
export default useSessionStorageState;
