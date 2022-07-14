import { ShapeFlages } from '../shared/ShapeFlages'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVNode (type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlages(type),
    el: null
  }

  // children
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlages.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlages.ARRAY_CHILDREN
  }

  if (vnode.shapeFlag & ShapeFlages.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlages.SLOT_CHILDREN
    }
  }

  return vnode
}

export function createTextVNode (text: string) {
  return createVNode(Text, {}, text)
}

function getShapeFlages (type: any) {
  return typeof type === 'string'
    ? ShapeFlages.ELEMENT
    : ShapeFlages.STATEFUL_COMPONENT
}
