export default function useHistoryTravel<T>(initialValue?: T, maxLength?: number): {
    value: import("vue").ComputedRef<import("vue").UnwrapRef<T>>;
    backLength: import("vue").ComputedRef<number>;
    forwardLength: import("vue").ComputedRef<number>;
    setValue: (this: unknown, val: T) => void;
    go: (this: unknown, step: number) => void;
    back: (this: unknown) => void;
    forward: (this: unknown) => void;
    reset: (this: unknown, ...args: any[]) => void;
};
