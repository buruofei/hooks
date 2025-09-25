import { watch } from 'vue'

const ImgTypeMap = {
  SVG: 'image/svg+xml',
  ICO: 'image/x-icon',
  GIF: 'image/gif',
  PNG: 'image/png',
}

type ImgTypes = keyof typeof ImgTypeMap

const useFavicon = (href: string) => {
  watch(() => href, (newHref) => {
    if (!newHref || typeof document === 'undefined') {
      return
    }

    const cutUrl = newHref.split('.')
    const imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase() as ImgTypes

    const link =
      document.querySelector<HTMLLinkElement>("link[rel*='icon']") ||
      document.createElement('link')

    link.type = ImgTypeMap[imgSuffix] || 'image/x-icon'
    link.href = newHref
    link.rel = 'shortcut icon'

    document.getElementsByTagName('head')[0].appendChild(link)
  }, { immediate: true })
}

export default useFavicon
