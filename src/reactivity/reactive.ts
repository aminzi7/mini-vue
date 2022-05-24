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

function createReactiveObject (raw, baseHanders) {
  return new Proxy(raw, baseHanders)
}

export function isReactive (value) {
  return !!value[ReactiveFlage.IS_REACTIVE]
}

export function isReadonly (value) {
  return !!value[ReactiveFlage.IS_READONLY]
}
