"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeMode = void 0;
exports.default = useTheme;
const vue_1 = require("vue");
const useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));
const isBrowser_1 = __importDefault(require("../utils/isBrowser"));
var ThemeMode;
(function (ThemeMode) {
    ThemeMode["LIGHT"] = "light";
    ThemeMode["DARK"] = "dark";
    ThemeMode["SYSTEM"] = "system";
})(ThemeMode || (exports.ThemeMode = ThemeMode = {}));
const useCurrentTheme = () => {
    const matchMedia = isBrowser_1.default ? window.matchMedia('(prefers-color-scheme: dark)') : undefined;
    const theme = (0, vue_1.ref)(() => {
        if (isBrowser_1.default) {
            return matchMedia?.matches ? ThemeMode.DARK : ThemeMode.LIGHT;
        }
        else {
            return ThemeMode.LIGHT;
        }
    });
    let onThemeChange = null;
    (0, vue_1.onMounted)(() => {
        onThemeChange = (event) => {
            if (event.matches) {
                theme.value = ThemeMode.DARK;
            }
            else {
                theme.value = ThemeMode.LIGHT;
            }
        };
        matchMedia?.addEventListener('change', onThemeChange);
    });
    (0, vue_1.onUnmounted)(() => {
        if (onThemeChange) {
            matchMedia?.removeEventListener('change', onThemeChange);
        }
    });
    return theme;
};
function useTheme(options = {}) {
    const { localStorageKey } = options;
    const themeMode = (0, vue_1.ref)(() => {
        const preferredThemeMode = localStorageKey?.length && localStorage.getItem(localStorageKey);
        return preferredThemeMode || ThemeMode.SYSTEM;
    });
    const setThemeModeWithLocalStorage = (mode) => {
        themeMode.value = mode;
        if (localStorageKey?.length) {
            localStorage.setItem(localStorageKey, mode);
        }
    };
    const currentTheme = useCurrentTheme();
    const theme = (0, vue_1.computed)(() => themeMode.value === ThemeMode.SYSTEM ? currentTheme.value : themeMode.value);
    return {
        theme,
        themeMode,
        setThemeMode: (0, useMemoizedFn_1.default)(setThemeModeWithLocalStorage),
    };
}