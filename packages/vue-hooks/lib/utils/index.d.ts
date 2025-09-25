export declare function isNumber(value: any): value is number;
export declare function isFunction(value: any): value is Function;
export declare function isString(value: any): value is string;
export declare function isBoolean(value: any): value is boolean;
export declare function isObject(value: any): value is object;
export declare function isUndefined(value: any): value is undefined;
export { isUndefined as isUndef };
export declare function isDefined<T>(value: T | undefined | null): value is T;
