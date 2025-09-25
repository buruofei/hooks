"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
function useWhyDidYouUpdate(componentName, props) {
    const prevProps = (0, vue_1.ref)({});
    (0, vue_1.watch)(() => props, (newProps) => {
        if (Object.keys(prevProps.value).length > 0) {
            const allKeys = Object.keys({ ...prevProps.value, ...newProps });
            const changedProps = {};
            allKeys.forEach((key) => {
                if (!Object.is(prevProps.value[key], newProps[key])) {
                    changedProps[key] = {
                        from: prevProps.value[key],
                        to: newProps[key],
                    };
                }
            });
            if (Object.keys(changedProps).length) {
                console.log('[why-did-you-update]', componentName, changedProps);
            }
        }
        prevProps.value = newProps;
    }, { deep: true });
}
exports.default = useWhyDidYouUpdate;