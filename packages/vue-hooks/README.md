# Vue Hooks

[![NPM version](https://img.shields.io/npm/v/vue-hooks.svg?style=flat)](https://npmjs.org/package/vue-hooks)
[![NPM downloads](http://img.shields.io/npm/dm/vue-hooks.svg?style=flat)](https://npmjs.org/package/vue-hooks)

Vue 3 hooks library based on [ahooks](https://github.com/alibaba/hooks).

## 🚀 Features

- 🔥 Vue 3 Composition API
- 💪 TypeScript support
- 🛡️ SSR support
- 📦 Tree shakable
- 🌍 Wide browser compatibility
- 📚 Rich documentation

## 📦 Install

```bash
npm install vue-hooks
# or
yarn add vue-hooks
# or
pnpm add vue-hooks
```

## 🔨 Usage

```vue
<template>
  <div>
    <button @click="toggle">{{ state ? 'ON' : 'OFF' }}</button>
  </div>
</template>

<script setup lang="ts">
import { useBoolean } from 'vue-hooks'

const [state, { toggle }] = useBoolean(false)
</script>
```

## 📚 Documentation

Visit [our documentation](https://ahooks.js.org) for detailed usage examples.

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md).

## 📄 License

[MIT](../../LICENSE)
