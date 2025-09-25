# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-09-25

### Added
- **State Management Hooks**
  - `useBoolean` - Manages boolean state with toggle, setTrue, setFalse methods
  - `useToggle` - Toggles between two values with flexible type support
  - `useCounter` - Counter with increment, decrement, min/max constraints

- **Effect Hooks**
  - `useDebounce` - Debounces a value with configurable delay
  - `useDebounceFn` - Debounces a function with lodash-compatible options
  - `useThrottle` - Throttles a value with configurable delay
  - `useThrottleFn` - Throttles a function with lodash-compatible options
  - `useMount` - Runs effect on component mount (Vue 3 onMounted)
  - `useUnmount` - Runs cleanup on component unmount (Vue 3 onUnmounted)
  - `useUpdate` - Forces component re-render
  - `useUpdateEffect` - Runs effect only on updates, not on mount

- **Event Hooks**
  - `useEventListener` - Manages DOM event listeners with automatic cleanup
  - `useClickAway` - Detects clicks outside target elements

- **Storage Hooks**
  - `useLocalStorageState` - Syncs state with localStorage
  - `useSessionStorageState` - Syncs state with sessionStorage
  - `createUseStorageState` - Factory for custom storage hooks

- **Utility Hooks**
  - `useLatest` - Always returns the latest value reference
  - `useMemoizedFn` - Memoizes functions to prevent unnecessary re-renders

### Features
- 🔥 **Vue 3 Composition API** - Built specifically for Vue 3
- 💪 **TypeScript Support** - Complete type definitions
- 🛡️ **SSR Support** - Safe for server-side rendering
- 📦 **Tree Shakable** - Import only what you need
- 🌍 **Cross-browser** - Works in all modern browsers
- 📚 **Well Documented** - Comprehensive docs and examples

### Migration from React Hooks
- All hooks maintain API compatibility with ahooks (React hooks library)
- State returns Vue 3 `Ref` objects instead of raw values
- Event handlers use Vue 3's lifecycle hooks (`onMounted`, `onUnmounted`)
- DOM targeting supports Vue 3 template refs
- Storage hooks work seamlessly with Vue 3 reactivity

### Breaking Changes
- None (initial release)

### Dependencies
- Vue 3.0+ (peer dependency)
- TypeScript support included
- Zero additional runtime dependencies for core functionality
