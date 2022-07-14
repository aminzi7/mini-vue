import { ShapeFlags } from '../shared/ShapeFlags'

export function initSolts (instance, children) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots (children, slots) {
  for (const key in children) {
    const value = children[key]
    slots[key] = props => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue (value) {
  return Array.isArray(value) ? value : [value]
}
