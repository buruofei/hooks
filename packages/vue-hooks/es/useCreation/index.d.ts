declare const useCreation: <T>(factory: () => T, deps: any[]) => import("vue").UnwrapRef<T>;
export default useCreation;
