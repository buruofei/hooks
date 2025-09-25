"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = isNumber;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isObject = isObject;
exports.isUndefined = isUndefined;
exports.isUndef = isUndefined;
exports.isDefined = isDefined;
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
function isFunction(value) {
    return typeof value === 'function';
}
function isString(value) {
    return typeof value === 'string';
}
function isBoolean(value) {
    return typeof value === 'boolean';
}
function isObject(value) {
    return value !== null && typeof value === 'object';
}
function isUndefined(value) {
    return typeof value === 'undefined';
}
function isDefined(value) {
    return value !== undefined && value !== null;
}