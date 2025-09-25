"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const screenfull_1 = __importDefault(require("../utils/screenfull"));
const useLatest_1 = __importDefault(require("../useLatest"));
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const domTarget_1 = require("../utils/domTarget");
const utils_1 = require("../utils");
const useFullscreen = (target, options) => {
    const { onExit, onEnter, pageFullscreen = false } = options || {};
    const { className = 'vue-hooks-page-fullscreen', zIndex = 999999 } = (0, utils_1.isBoolean)(pageFullscreen) || !pageFullscreen ? {} : pageFullscreen;
    const onExitRef = (0, useLatest_1.default)(onExit);
    const onEnterRef = (0, useLatest_1.default)(onEnter);
    // The state of full screen may be changed by other scripts/components,
    // so the initial value needs to be computed dynamically.
    const state = (0, vue_1.ref)(false);
    const stateRef = (0, vue_1.ref)(false);
    function getIsFullscreen() {
        return (screenfull_1.default.isEnabled &&
            !!screenfull_1.default.element &&
            screenfull_1.default.element === (0, domTarget_1.getTargetElement)(target));
    }
    const invokeCallback = (fullscreen) => {
        if (fullscreen) {
            onEnterRef.value?.();
        }
        else {
            onExitRef.value?.();
        }
    };
    const updateFullscreenState = (fullscreen) => {
        // Prevent repeated calls when the state is not changed.
        if (stateRef.value !== fullscreen) {
            invokeCallback(fullscreen);
            state.value = fullscreen;
            stateRef.value = fullscreen;
        }
    };
    const onScreenfullChange = () => {
        const fullscreen = getIsFullscreen();
        updateFullscreenState(fullscreen);
    };
    const togglePageFullscreen = (fullscreen) => {
        const el = (0, domTarget_1.getTargetElement)(target);
        if (!el) {
            return;
        }
        let styleElem = document.getElementById(className);
        if (fullscreen) {
            el.classList.add(className);
            if (!styleElem) {
                styleElem = document.createElement('style');
                styleElem.setAttribute('id', className);
                styleElem.textContent = `
          .${className} {
            position: fixed; left: 0; top: 0; right: 0; bottom: 0;
            width: 100% !important; height: 100% !important;
            z-index: ${zIndex};
          }`;
                el.appendChild(styleElem);
            }
        }
        else {
            el.classList.remove(className);
            if (styleElem) {
                styleElem.remove();
            }
        }
        updateFullscreenState(fullscreen);
    };
    const enterFullscreen = (0, useMemoizedFn_1.default)(() => {
        const el = (0, domTarget_1.getTargetElement)(target);
        if (!el) {
            return;
        }
        if (pageFullscreen) {
            togglePageFullscreen(true);
            return;
        }
        if (screenfull_1.default.isEnabled) {
            try {
                screenfull_1.default.request(el);
            }
            catch (error) {
                console.error(error);
            }
        }
    });
    const exitFullscreen = (0, useMemoizedFn_1.default)(() => {
        const el = (0, domTarget_1.getTargetElement)(target);
        if (!el) {
            return;
        }
        if (pageFullscreen) {
            togglePageFullscreen(false);
            return;
        }
        if (screenfull_1.default.isEnabled && screenfull_1.default.element === el) {
            screenfull_1.default.exit();
        }
    });
    const toggleFullscreen = (0, useMemoizedFn_1.default)(() => {
        if (state.value) {
            exitFullscreen();
        }
        else {
            enterFullscreen();
        }
    });
    // Initialize state
    (0, vue_1.watch)(() => target, () => {
        state.value = getIsFullscreen();
        stateRef.value = state.value;
    }, { immediate: true });
    (0, vue_1.onMounted)(() => {
        if (!screenfull_1.default.isEnabled || pageFullscreen) {
            return;
        }
        screenfull_1.default.on('change', onScreenfullChange);
    });
    (0, vue_1.onUnmounted)(() => {
        if (screenfull_1.default.isEnabled && !pageFullscreen) {
            screenfull_1.default.off('change', onScreenfullChange);
        }
    });
    return [
        state,
        {
            enterFullscreen,
            exitFullscreen,
            toggleFullscreen,
            isEnabled: screenfull_1.default.isEnabled,
        },
    ];
};
exports.default = useFullscreen;