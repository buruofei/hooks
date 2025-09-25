"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function depsAreSame(oldDeps, deps) {
    if (oldDeps === deps)
        return true;
    if (oldDeps.length !== deps.length)
        return false;
    for (let i = 0; i < oldDeps.length; i++) {
        if (!Object.is(oldDeps[i], deps[i]))
            return false;
    }
    return true;
}
exports.default = depsAreSame;