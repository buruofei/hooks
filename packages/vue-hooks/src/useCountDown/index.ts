import { ref, computed, watch, onUnmounted } from 'vue'
import useLatest from '../useLatest'
import { isNumber } from '../utils'

export type TDate = string | number | Date

export interface Options {
  leftTime?: number
  targetDate?: TDate
  interval?: number
  onEnd?: () => void
}

export interface FormattedRes {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

const calcLeft = (target?: TDate) => {
  if (!target) {
    return 0
  }
  
  const targetTime = typeof target === 'string' ? new Date(target).getTime() : 
                    typeof target === 'number' ? target :
                    target.getTime()
  
  const left = targetTime - Date.now()
  return left < 0 ? 0 : left
}

const parseMs = (milliseconds: number): FormattedRes => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  }
}

const useCountDown = (options: Options = {}) => {
  const { leftTime, targetDate, interval = 1000, onEnd } = options || {}

  const memoLeftTime = computed<TDate | undefined>(() => {
    return isNumber(leftTime) && leftTime > 0 ? Date.now() + leftTime : undefined
  })

  const target = computed(() => 'leftTime' in options ? memoLeftTime.value : targetDate)

  const timeLeft = ref(calcLeft(target.value))
  const onEndRef = useLatest(onEnd)

  let timer: ReturnType<typeof setInterval> | null = null

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const startTimer = () => {
    clearTimer()
    
    if (!target.value) {
      // for stop
      timeLeft.value = 0
      return
    }

    // 立即执行一次
    timeLeft.value = calcLeft(target.value)

    timer = setInterval(() => {
      const targetLeft = calcLeft(target.value)
      timeLeft.value = targetLeft
      if (targetLeft === 0) {
        clearTimer()
        onEndRef.value?.()
      }
    }, interval)
  }

  watch(() => [target.value, interval], startTimer, { immediate: true })

  onUnmounted(() => {
    clearTimer()
  })

  const formattedRes = computed(() => parseMs(timeLeft.value))

  return [timeLeft, formattedRes] as const
}

export default useCountDown
