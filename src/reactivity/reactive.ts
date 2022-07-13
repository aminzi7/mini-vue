import { isObject } from '../shared'
import {
  mutableHanders,
  readonlyHanders,
  shallowReadonlyHanders
} from './baseHanders'

export const enum ReactiveFlage {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive (raw) {
  return createReactiveObject(raw, mutableHanders)
}

export function readonly (raw) {
  return createReactiveObject(raw, readonlyHanders)
}

export function shallowReadonly (raw) {
  return createReactiveObject(raw, shallowReadonlyHanders)
}

export function isProxy (val) {
  return isReactive(val) || isReadonly(val)
}

function createReactiveObject (target, baseHanders) {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`)
    return target
  }
  return new Proxy(target, baseHanders)
}

// 判断
export function isReactive (value) {
  return !!value[ReactiveFlage.IS_REACTIVE]
}

export function isReadonly (value) {
  return !!value[ReactiveFlage.IS_READONLY]
}
