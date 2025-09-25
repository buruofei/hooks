import { ref } from 'vue'

const useUpdate = () => {
  const count = ref(0)

  return () => {
    count.value += 1
  }
}

export default useUpdate
