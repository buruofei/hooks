<template>
  <div class="demo">
    <h1>Vue Hooks Demo</h1>
    
    <!-- Boolean Hook Demo -->
    <section>
      <h2>useBoolean</h2>
      <p>Status: {{ state ? 'ON' : 'OFF' }}</p>
      <button @click="toggle">Toggle</button>
      <button @click="setTrue">Set True</button>
      <button @click="setFalse">Set False</button>
    </section>

    <!-- Counter Hook Demo -->
    <section>
      <h2>useCounter</h2>
      <p>Count: {{ count }}</p>
      <button @click="inc">+1</button>
      <button @click="dec">-1</button>
      <button @click="() => set(10)">Set to 10</button>
      <button @click="reset">Reset</button>
    </section>

    <!-- Debounce Hook Demo -->
    <section>
      <h2>useDebounce</h2>
      <input v-model="input" placeholder="Type something..." />
      <p>Debounced value: {{ debouncedValue }}</p>
    </section>

    <!-- Toggle Hook Demo -->
    <section>
      <h2>useToggle</h2>
      <p>Current: {{ toggleState }}</p>
      <button @click="toggleFn">Toggle between 'A' and 'B'</button>
      <button @click="setLeft">Set A</button>
      <button @click="setRight">Set B</button>
    </section>

    <!-- Local Storage Demo -->
    <section>
      <h2>useLocalStorageState</h2>
      <input v-model="storageValue" placeholder="This value persists in localStorage" />
      <p>Stored value: {{ storageValue }}</p>
      <button @click="clearStorage">Clear</button>
    </section>

    <!-- Click Away Demo -->
    <section>
      <h2>useClickAway</h2>
      <div ref="clickAwayRef" class="click-away-box" :class="{ clicked: isClicked }">
        Click outside this box
      </div>
      <p v-if="isClicked">You clicked outside!</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  useBoolean,
  useCounter,
  useDebounce,
  useToggle,
  useLocalStorageState,
  useClickAway
} from './src/index'

// Boolean hook demo
const [state, { toggle, setTrue, setFalse }] = useBoolean(false)

// Counter hook demo
const [count, { inc, dec, set, reset }] = useCounter(0, { min: 0, max: 100 })

// Debounce hook demo
const input = ref('')
const debouncedValue = useDebounce(input, { wait: 500 })

// Toggle hook demo
const [toggleState, { toggle: toggleFn, setLeft, setRight }] = useToggle('A', 'B')

// Local storage demo
const [storageValue, setStorageValue] = useLocalStorageState('demo-key', { defaultValue: 'Hello Vue Hooks!' })
const clearStorage = () => setStorageValue(undefined)

// Click away demo
const clickAwayRef = ref<HTMLElement>()
const isClicked = ref(false)

useClickAway(() => {
  isClicked.value = true
  setTimeout(() => {
    isClicked.value = false
  }, 1000)
}, clickAwayRef)
</script>

<style scoped>
.demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

h1, h2 {
  color: #333;
}

button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 5px;
}

.click-away-box {
  width: 200px;
  height: 100px;
  border: 2px solid #007bff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.click-away-box.clicked {
  background: #ffeb3b;
  border-color: #ffc107;
}
</style>
