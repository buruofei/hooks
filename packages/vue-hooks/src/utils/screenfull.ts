// Simple screenfull polyfill for Vue hooks
interface ScreenfullAPI {
  isEnabled: boolean
  element: Element | null
  request: (element?: Element) => Promise<void>
  exit: () => Promise<void>
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
}

const eventListeners: { [key: string]: (() => void)[] } = {}

const screenfull: ScreenfullAPI = {
  get isEnabled() {
    return !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    )
  },

  get element() {
    return (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      null
    )
  },

  async request(element = document.documentElement) {
    if (element.requestFullscreen) {
      return element.requestFullscreen()
    } else if ((element as any).webkitRequestFullscreen) {
      return (element as any).webkitRequestFullscreen()
    } else if ((element as any).mozRequestFullScreen) {
      return (element as any).mozRequestFullScreen()
    } else if ((element as any).msRequestFullscreen) {
      return (element as any).msRequestFullscreen()
    }
    return Promise.reject(new Error('Fullscreen not supported'))
  },

  async exit() {
    if (document.exitFullscreen) {
      return document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      return (document as any).webkitExitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      return (document as any).mozCancelFullScreen()
    } else if ((document as any).msExitFullscreen) {
      return (document as any).msExitFullscreen()
    }
    return Promise.reject(new Error('Fullscreen exit not supported'))
  },

  on(event: string, callback: () => void) {
    if (!eventListeners[event]) {
      eventListeners[event] = []
    }
    eventListeners[event].push(callback)

    if (event === 'change') {
      const events = [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
      ]
      
      events.forEach(eventName => {
        document.addEventListener(eventName, callback)
      })
    }
  },

  off(event: string, callback: () => void) {
    if (eventListeners[event]) {
      const index = eventListeners[event].indexOf(callback)
      if (index > -1) {
        eventListeners[event].splice(index, 1)
      }
    }

    if (event === 'change') {
      const events = [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
      ]
      
      events.forEach(eventName => {
        document.removeEventListener(eventName, callback)
      })
    }
  }
}

export default screenfull
