import { ShapeFlages } from '../shared/ShapeFlages'

export function initSolts (instance, children) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlages.STATEFUL_COMPONENT) {
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
