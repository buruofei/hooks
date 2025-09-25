"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const lodash_1 = require("lodash");
// Deep compare effect using lodash isEqual
function useDeepCompareEffect(effect, deps, options) {
    let prevDeps;
    (0, vue_1.watch)(deps, (newDeps, oldDeps, onCleanup) => {
        // Use deep comparison instead of reference comparison
        if (!(0, lodash_1.isEqual)(prevDeps, newDeps)) {
            prevDeps = JSON.parse(JSON.stringify(newDeps)); // Deep clone
            return effect(newDeps, oldDeps, onCleanup);
        }
    }, options);
}
exports.default = useDeepCompareEffect;
