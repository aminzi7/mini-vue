import { mutableHanders, readonlyHanders } from './baseHanders'

export function reactive (raw) {
  return createActiveObject(raw, mutableHanders)
}

export function readonly (raw) {
  return createActiveObject(raw, readonlyHanders)
}

function createActiveObject (raw, baseHanders) {
  return new Proxy(raw, baseHanders)
}
