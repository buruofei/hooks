"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const diffTwoDeps = (deps1, deps2) => {
    // Let's do a reference equality check on 2 dependency list.
    // If deps1 is defined, we iterate over deps1 and do comparison on each element with equivalent element from deps2
    // As this func is used only in this hook, we assume 2 deps always have same length.
    return deps1
        ? deps1
            .map((_, idx) => (!Object.is(deps1[idx], deps2?.[idx]) ? idx : -1))
            .filter((ele) => ele >= 0)
        : deps2
            ? deps2.map((_, idx) => idx)
            : [];
};
const useTrackedEffect = (effect, deps) => {
    const previousDepsRef = (0, vue_1.ref)();
    (0, vue_1.watch)(deps || [], (newDeps) => {
        const changes = diffTwoDeps(previousDepsRef.value, newDeps);
        const previousDeps = previousDepsRef.value;
        previousDepsRef.value = newDeps;
        return effect(changes, previousDeps, newDeps);
    });
};
exports.default = useTrackedEffect;