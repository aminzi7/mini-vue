import { ShapeFlages } from '../shared/ShapeFlages'
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

  return vnode
}

function getShapeFlages (type: any) {
  return typeof type === 'string'
    ? ShapeFlages.ELEMENT
    : ShapeFlages.STATEFUL_COMPONENT
}
