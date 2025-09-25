export declare enum ThemeMode {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system"
}
export type ThemeModeType = `${ThemeMode}`;
export type ThemeType = 'light' | 'dark';
type Options = {
    localStorageKey?: string;
};
export default function useTheme(options?: Options): {
    theme: import("vue").ComputedRef<ThemeType>;
    themeMode: import("vue").Ref<"dark" | "light" | "system", "dark" | "light" | "system">;
    setThemeMode: (this: unknown, mode: "dark" | "light" | "system") => void;
};
export {};
