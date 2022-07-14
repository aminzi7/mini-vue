import { createVNode } from './vnode'

export function createAppAPI (render) {
  return function createApp (rootComponent) {
    return {
      mount (rootContainer) {
        // 把组件 -> 虚拟节点
        const vnode = createVNode(rootComponent)
        render(vnode, rootContainer)
      }
    }
  }
}
