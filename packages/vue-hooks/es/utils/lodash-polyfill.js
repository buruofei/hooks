"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = debounce;
exports.throttle = throttle;
function debounce(func, wait = 0, options = {}) {
    const { leading = false, trailing = true, maxWait } = options;
    let lastCallTime;
    let lastInvokeTime = 0;
    let timerId;
    let result;
    function invokeFunc(time) {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        return maxWait !== undefined
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    }
    function shouldInvoke(time) {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxWait !== undefined && timeSinceLastInvoke >= maxWait));
    }
    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
        timerId = undefined;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }
    function cancel() {
        if (timerId !== undefined) {
            clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }
    let lastArgs;
    let lastThis;
    function debounced(...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxWait !== undefined) {
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = setTimeout(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}
function throttle(func, wait = 0, options = {}) {
    const { leading = true, trailing = true } = options;
    return debounce(func, wait, {
        leading,
        trailing,
        maxWait: wait
    });
}