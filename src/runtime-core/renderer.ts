import { createComponentInstance, setupComponent } from './component'

export function render (vnode, container) {
  // path 后面的递归
  path(vnode, container)
}

function path (vnode, container) {
  // 判断是不是element
  // 是element就处理
  processComponent(vnode, container)
}

function processComponent (vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent (vnode: any, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect (instance, container) {
  const subTree = instance.render()
  // vnode is element -> mountelement
  path(subTree, container)
}
