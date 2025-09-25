import { ref, watch, onUnmounted } from 'vue'

type JsOptions = {
  type: 'js'
  js?: Partial<HTMLScriptElement>
  keepWhenUnused?: boolean
}

type CssOptions = {
  type: 'css'
  css?: Partial<HTMLStyleElement>
  keepWhenUnused?: boolean
}

type DefaultOptions = {
  type?: never
  js?: Partial<HTMLScriptElement>
  css?: Partial<HTMLStyleElement>
  keepWhenUnused?: boolean
}

export type Options = JsOptions | CssOptions | DefaultOptions

// {[path]: count}
// remove external when no used
const EXTERNAL_USED_COUNT: Record<string, number> = {}

export type Status = 'unset' | 'loading' | 'ready' | 'error'

interface LoadResult {
  ref: Element
  status: Status
}

type LoadExternal = <T>(path: string, props?: Partial<T>) => LoadResult

const loadScript: LoadExternal = (path, props = {}) => {
  const script = document.querySelector(`script[src="${path}"]`)

  if (!script) {
    const newScript = document.createElement('script')
    newScript.src = path

    Object.keys(props).forEach((key) => {
      ;(newScript as any)[key] = (props as any)[key]
    })

    newScript.setAttribute('data-status', 'loading')
    document.body.appendChild(newScript)

    return {
      ref: newScript,
      status: 'loading',
    }
  }

  return {
    ref: script,
    status: (script.getAttribute('data-status') as Status) || 'ready',
  }
}

const loadCss: LoadExternal = (path, props = {}) => {
  const css = document.querySelector(`link[href="${path}"]`)
  if (!css) {
    const newCss = document.createElement('link')

    newCss.rel = 'stylesheet'
    newCss.href = path
    Object.keys(props).forEach((key) => {
      ;(newCss as any)[key] = (props as any)[key]
    })
    // IE9+
    const isLegacyIECss = 'hideFocus' in newCss
    // use preload in IE Edge (to detect load errors)
    if (isLegacyIECss && (newCss as any).relList) {
      newCss.rel = 'preload'
      ;(newCss as any).as = 'style'
    }
    newCss.setAttribute('data-status', 'loading')
    document.head.appendChild(newCss)

    return {
      ref: newCss,
      status: 'loading',
    }
  }

  return {
    ref: css,
    status: (css.getAttribute('data-status') as Status) || 'ready',
  }
}

const useExternal = (path?: string, options?: Options) => {
  const status = ref<Status>(path ? 'loading' : 'unset')
  const elementRef = ref<Element>()

  let cleanup: (() => void) | null = null

  const setupExternal = () => {
    if (cleanup) {
      cleanup()
      cleanup = null
    }

    if (!path) {
      status.value = 'unset'
      return
    }

    const pathname = path.replace(/[|#].*$/, '')
    let result: LoadResult

    if (options?.type === 'css' || (!options?.type && /(^css!|\.css$)/.test(pathname))) {
      result = loadCss(path, options?.css)
    } else if (options?.type === 'js' || (!options?.type && /(^js!|\.js$)/.test(pathname))) {
      result = loadScript(path, options?.js)
    } else {
      // do nothing
      console.error(
        "Cannot infer the type of external resource, and please provide a type ('js' | 'css'). " +
          'Refer to the https://ahooks.js.org/hooks/dom/use-external/#options',
      )
      return
    }

    elementRef.value = result.ref
    status.value = result.status

    if (!elementRef.value) {
      return
    }

    if (EXTERNAL_USED_COUNT[path] === undefined) {
      EXTERNAL_USED_COUNT[path] = 1
    } else {
      EXTERNAL_USED_COUNT[path] += 1
    }

    const handler = (event: Event) => {
      const targetStatus = event.type === 'load' ? 'ready' : 'error'
      elementRef.value?.setAttribute('data-status', targetStatus)
      status.value = targetStatus as Status
    }

    elementRef.value.addEventListener('load', handler)
    elementRef.value.addEventListener('error', handler)

    cleanup = () => {
      elementRef.value?.removeEventListener('load', handler)
      elementRef.value?.removeEventListener('error', handler)

      if (path) {
        EXTERNAL_USED_COUNT[path] -= 1

        if (EXTERNAL_USED_COUNT[path] === 0 && !options?.keepWhenUnused) {
          elementRef.value?.remove()
        }
      }

      elementRef.value = undefined
    }
  }

  watch(() => path, setupExternal, { immediate: true })

  onUnmounted(() => {
    if (cleanup) {
      cleanup()
    }
  })

  return status
}

export default useExternal
