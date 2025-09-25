# v-hooks

<p align="center">
  <img src="https://img.shields.io/npm/v/v-hooks.svg" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/v-hooks.svg" alt="npm downloads" />
  <img src="https://img.shields.io/bundlephobia/minzip/v-hooks.svg" alt="bundle size" />
  <img src="https://img.shields.io/github/license/buruofei/hooks.svg" alt="license" />
</p>

A high-quality & reliable **Vue 3 Composition API** hooks library, ported from [ahooks](https://github.com/alibaba/hooks).

English | [简体中文](./README.zh-CN.md)

## ✨ Features

- 🎯 **Vue 3 Native**: Built specifically for Vue 3 Composition API
- 🔥 **77+ Hooks**: Complete port of all ahooks with Vue 3 equivalents  
- 💪 **TypeScript**: Written in TypeScript with full type support
- 🌍 **SSR Support**: Works seamlessly with server-side rendering
- 📦 **Tree Shaking**: Optimized bundle size with ES modules
- 🎨 **Easy Migration**: Familiar API for ahooks users
- ⚡ **Performance**: Optimized for Vue 3 reactivity system

## 📦 Installation

```bash
npm install v-hooks
# or
yarn add v-hooks
# or
pnpm add v-hooks
```

## 🔨 Quick Start

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup lang="ts">
import { useCounter } from 'v-hooks'

const [count, { increment, decrement, reset }] = useCounter(0)
</script>
```

## 📚 Hooks Categories

### State Management
- `useBoolean` - Boolean state management
- `useToggle` - Toggle between values  
- `useCounter` - Counter with actions
- `useMap` - Map state management
- `useSet` - Set state management
- `useReactive` - Reactive object state

### Effect Hooks  
- `useDebounce` / `useDebounceFn` - Debounced values/functions
- `useThrottle` / `useThrottleFn` - Throttled values/functions
- `useMount` / `useUnmount` - Lifecycle hooks
- `useUpdateEffect` - Effect that skips first render
- `useAsyncEffect` - Async effect with cleanup

### DOM & Events
- `useEventListener` - Add event listeners
- `useClickAway` - Click outside detection
- `useHover` - Hover state tracking
- `useMouse` - Mouse position tracking
- `useSize` - Element size tracking
- `useScroll` - Scroll position tracking

### Storage & Network
- `useLocalStorageState` - localStorage with reactivity
- `useSessionStorageState` - sessionStorage with reactivity  
- `useNetwork` - Network status monitoring
- `useRequest` - Data fetching with caching

### Advanced Features
- `useVirtualList` - Virtual scrolling
- `usePagination` - Pagination logic
- `useInfiniteScroll` - Infinite scrolling
- `useSelections` - Multiple selections
- `useHistoryTravel` - Undo/redo functionality

**[View all 77+ hooks →](https://github.com/buruofei/hooks/tree/master/packages/vue-hooks/src)**

## 🌟 Why v-hooks?

### Familiar API
If you're coming from React's ahooks, you'll feel right at home:

```typescript
// React (ahooks)
const [count, { increment }] = useCounter(0)

// Vue (v-hooks) - Same API!
const [count, { increment }] = useCounter(0)
```

### Vue 3 Optimized
Built specifically for Vue 3's reactivity system:

```vue
<script setup>
import { useDebounce } from 'v-hooks'

const input = ref('')
const debouncedValue = useDebounce(input, 500)

// Automatically reactive - no manual watching needed!
</script>
```

### TypeScript First
Full TypeScript support with intelligent IntelliSense:

```typescript
import { useRequest } from 'v-hooks'

interface User {
  id: number
  name: string
}

const { data, loading, error } = useRequest<User[]>('/api/users')
// data is automatically typed as User[] | undefined
```

## 🔨 Usage Examples

### Basic State Management

```vue
<script setup>
import { useBoolean, useToggle, useCounter } from 'v-hooks'

// Boolean state
const [loading, { setTrue: startLoading, setFalse: stopLoading }] = useBoolean(false)

// Toggle between values
const [theme, { toggle: toggleTheme }] = useToggle('light', 'dark')

// Counter with actions
const [count, { increment, decrement, reset }] = useCounter(0)
</script>
```

### DOM & Events

```vue
<script setup>
import { useEventListener, useClickAway, useHover } from 'v-hooks'

const buttonRef = ref()
const isHovering = useHover(buttonRef)

useEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    console.log('Escape pressed!')
  }
})

useClickAway(() => {
  console.log('Clicked outside!')
}, buttonRef)
</script>
```

### Storage & Persistence

```vue
<script setup>
import { useLocalStorageState, useSessionStorageState } from 'v-hooks'

// Persisted in localStorage
const [user, setUser] = useLocalStorageState('user', { name: 'Guest' })

// Persisted in sessionStorage  
const [token, setToken] = useSessionStorageState('auth-token')
</script>
```

## 🤝 Contributing

We welcome all contributions! Please read our [Contributing Guide](https://github.com/buruofei/hooks/blob/master/CONTRIBUTING.md).

## 📄 License

MIT License © 2024 v-hooks team

## 🙏 Acknowledgments

Special thanks to the [ahooks](https://github.com/alibaba/hooks) team for creating such an amazing React hooks library that inspired this Vue 3 port.