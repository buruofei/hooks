const isAppleDevice = typeof navigator !== 'undefined' && 
  /Mac|iPod|iPhone|iPad/.test(navigator.platform)

export default isAppleDevice
