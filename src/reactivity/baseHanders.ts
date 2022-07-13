import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, ReactiveFlage, readonly } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter (isReadonly = false, shallow = false) {
  return function get (target, key) {
    // 判断isReactive
    if (key === ReactiveFlage.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlage.IS_READONLY) {
      // 判断 isReadonly
      return isReadonly
    }

    const res = Reflect.get(target, key)
    // 识别shallowReadonly
    // 特点是：第一层是只读，第二层一下是普通对象，
    // 识别出shallowReadonly，后面没必要执行
    if (shallow) {
      return res
    }

    // 判断是不是一个对象
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
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
    console.warn(`key:${key} 不可 set target 是readonly`, target)

    return true
  }
}

export const shallowReadonlyHanders = extend({}, readonlyHanders, {
  get: shallowReadonlyGet
})
