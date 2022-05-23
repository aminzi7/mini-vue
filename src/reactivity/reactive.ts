import { mutableHanders, readonlyHanders } from './baseHanders'

export const enum ReactiveFlage {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive (raw) {
  return createActiveObject(raw, mutableHanders)
}

export function readonly (raw) {
  return createActiveObject(raw, readonlyHanders)
}

function createActiveObject (raw, baseHanders) {
  return new Proxy(raw, baseHanders)
}

export function isReactive (value) {
  return !!value[ReactiveFlage.IS_REACTIVE]
}

export function isReadonly (value) {
  return !!value[ReactiveFlage.IS_READONLY]
}
