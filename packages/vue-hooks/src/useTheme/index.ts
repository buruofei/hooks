import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import isBrowser from '../utils/isBrowser'

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export type ThemeModeType = `${ThemeMode}`

export type ThemeType = 'light' | 'dark'

const useCurrentTheme = () => {
  const matchMedia = isBrowser ? window.matchMedia('(prefers-color-scheme: dark)') : undefined
  const theme = ref<ThemeType>(() => {
    if (isBrowser) {
      return matchMedia?.matches ? ThemeMode.DARK : ThemeMode.LIGHT
    } else {
      return ThemeMode.LIGHT
    }
  })

  let onThemeChange: ((event: MediaQueryListEvent) => void) | null = null

  onMounted(() => {
    onThemeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        theme.value = ThemeMode.DARK
      } else {
        theme.value = ThemeMode.LIGHT
      }
    }

    matchMedia?.addEventListener('change', onThemeChange)
  })

  onUnmounted(() => {
    if (onThemeChange) {
      matchMedia?.removeEventListener('change', onThemeChange)
    }
  })

  return theme
}

type Options = {
  localStorageKey?: string
}

export default function useTheme(options: Options = {}) {
  const { localStorageKey } = options

  const themeMode = ref<ThemeModeType>(() => {
    const preferredThemeMode =
      localStorageKey?.length && (localStorage.getItem(localStorageKey) as ThemeModeType | null)

    return preferredThemeMode || ThemeMode.SYSTEM
  })

  const setThemeModeWithLocalStorage = (mode: ThemeModeType) => {
    themeMode.value = mode

    if (localStorageKey?.length) {
      localStorage.setItem(localStorageKey, mode)
    }
  }

  const currentTheme = useCurrentTheme()
  const theme = computed(() => 
    themeMode.value === ThemeMode.SYSTEM ? currentTheme.value : themeMode.value
  )

  return {
    theme,
    themeMode,
    setThemeMode: useMemoizedFn(setThemeModeWithLocalStorage),
  }
}
