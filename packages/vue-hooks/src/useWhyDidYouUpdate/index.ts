import { watch, ref } from 'vue'

export type IProps = Record<string, any>

function useWhyDidYouUpdate(componentName: string, props: IProps) {
  const prevProps = ref<IProps>({})

  watch(() => props, (newProps) => {
    if (Object.keys(prevProps.value).length > 0) {
      const allKeys = Object.keys({ ...prevProps.value, ...newProps })
      const changedProps: IProps = {}

      allKeys.forEach((key) => {
        if (!Object.is(prevProps.value[key], newProps[key])) {
          changedProps[key] = {
            from: prevProps.value[key],
            to: newProps[key],
          }
        }
      })

      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', componentName, changedProps)
      }
    }

    prevProps.value = newProps
  }, { deep: true })
}

export default useWhyDidYouUpdate
