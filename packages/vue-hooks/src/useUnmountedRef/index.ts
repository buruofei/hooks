import { ref, onUnmounted, type Ref } from 'vue'

function useUnmountedRef(): Ref<boolean> {
  const unmountedRef = ref(false)
  
  onUnmounted(() => {
    unmountedRef.value = true
  })
  
  return unmountedRef
}

export default useUnmountedRef
