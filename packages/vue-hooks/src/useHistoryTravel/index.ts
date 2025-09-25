import { ref, computed } from 'vue'
import useMemoizedFn from '../useMemoizedFn'
import { isNumber } from '../utils'

interface IData<T> {
  present?: T
  past: T[]
  future: T[]
}

const dumpIndex = <T>(step: number, arr: T[]) => {
  let index =
    step > 0
      ? step - 1 // move forward
      : arr.length + step // move backward
  if (index >= arr.length - 1) {
    index = arr.length - 1
  }
  if (index < 0) {
    index = 0
  }
  return index
}

const split = <T>(step: number, targetArr: T[]) => {
  const index = dumpIndex(step, targetArr)
  return {
    _current: targetArr[index],
    _before: targetArr.slice(0, index),
    _after: targetArr.slice(index + 1),
  }
}

export default function useHistoryTravel<T>(initialValue?: T, maxLength: number = 0) {
  const history = ref<IData<T | undefined>>({
    present: initialValue,
    past: [],
    future: [],
  })

  const present = computed(() => history.value.present)
  const past = computed(() => history.value.past)
  const future = computed(() => history.value.future)

  const initialValueRef = ref(initialValue)

  const reset = useMemoizedFn((...params: any[]) => {
    const _initial = params.length > 0 ? params[0] : initialValueRef.value
    initialValueRef.value = _initial

    history.value = {
      present: _initial,
      future: [],
      past: [],
    }
  })

  const updateValue = useMemoizedFn((val: T) => {
    const _past = [...past.value, present.value]
    const maxLengthNum = isNumber(maxLength) ? maxLength : Number(maxLength)
    // maximum number of records exceeded
    if (maxLengthNum > 0 && _past.length > maxLengthNum) {
      //delete first
      _past.splice(0, 1)
    }

    history.value = {
      present: val,
      future: [],
      past: _past as any,
    }
  })

  const _forward = (step: number = 1) => {
    if (future.value.length === 0) {
      return
    }
    const { _before, _current, _after } = split(step, future.value)
    history.value = {
      past: [...past.value, present.value, ..._before] as any,
      present: _current as any,
      future: _after as any,
    }
  }

  const _backward = (step: number = -1) => {
    if (past.value.length === 0) {
      return
    }

    const { _before, _current, _after } = split(step, past.value)
    history.value = {
      past: _before as any,
      present: _current as any,
      future: [..._after, present.value, ...future.value] as any,
    }
  }

  const go = useMemoizedFn((step: number) => {
    const stepNum = isNumber(step) ? step : Number(step)
    if (stepNum === 0) {
      return
    }
    if (stepNum > 0) {
      return _forward(stepNum)
    }
    _backward(stepNum)
  })

  return {
    value: present,
    backLength: computed(() => past.value.length),
    forwardLength: computed(() => future.value.length),
    setValue: updateValue,
    go,
    back: useMemoizedFn(() => {
      go(-1)
    }),
    forward: useMemoizedFn(() => {
      go(1)
    }),
    reset,
  }
}
