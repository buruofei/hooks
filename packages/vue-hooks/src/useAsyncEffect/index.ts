import { watch, onUnmounted, type WatchSource } from 'vue'
import { isFunction } from '../utils'

function isAsyncGenerator(
  val: AsyncGenerator<void, void, void> | Promise<void>,
): val is AsyncGenerator<void, void, void> {
  return isFunction((val as any)[Symbol.asyncIterator])
}

function useAsyncEffect(
  effect: () => AsyncGenerator<void, void, void> | Promise<void>,
  deps?: WatchSource | WatchSource[],
) {
  let cancelled = false

  const execute = async () => {
    const e = effect()
    cancelled = false
    
    if (isAsyncGenerator(e)) {
      while (true) {
        const result = await e.next()
        if (result.done || cancelled) {
          break
        }
      }
    } else {
      await e
    }
  }

  const cleanup = () => {
    cancelled = true
  }

  if (deps) {
    watch(deps, execute, { immediate: true })
  } else {
    // 如果没有依赖，只在组件挂载时执行一次
    execute()
  }

  onUnmounted(() => {
    cleanup()
  })
}

export default useAsyncEffect
