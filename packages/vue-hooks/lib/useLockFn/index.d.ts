declare function useLockFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>): (this: unknown, ...args: P) => Promise<V>;
export default useLockFn;
