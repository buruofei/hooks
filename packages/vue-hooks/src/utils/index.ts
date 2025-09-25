export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value)
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object'
}

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined'
}

export { isUndefined as isUndef }

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}
