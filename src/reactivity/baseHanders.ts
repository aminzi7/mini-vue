import { track, trigger } from './effect'
import { ReactiveFlage } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter (isReadonly = false) {
  return function get (target, key) {
    const res = Reflect.get(target, key)
    // 判断isReactive
    if (key === ReactiveFlage.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlage.IS_READONLY) {
      // 判断 isReadonly
      return isReadonly
    }

    if (!isReadonly) {
      // 收集依赖
      track(target, key)
    }

    return res
  }
}

function createSetter () {
  return function set (target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHanders = {
  get,
  set
}
export const readonlyHanders = {
  get: readonlyGet,
  set (target, key, value) {
    // console.warn(`key:${key} 不可 set target 是readonly`, target)
    console.warn('ssss')

    return true
  }
}
