import { isObject } from '../shared/index'
import { ShapeFlages } from '../shared/ShapeFlages'
import { createComponentInstance, setupComponent } from './component'

export function render (vnode, container) {
  // patch 后面的递归
  patch(vnode, container)
}

function patch (vnode, container) {
  // 判断是不是element
  // 是element就处理
  // 区分 element 和 组件
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlages.ELEMENT) {
    processElement(vnode, container)
    // isObject 判断对象
  } else if (shapeFlag & ShapeFlages.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  }
}

function processElement (vnode: any, container: any) {
  // init -> mount
  // 初始化
  mountElement(vnode, container)
}

// 初始化
function mountElement (vnode: any, container: any) {
  // 相当于 vnode type
  const el = (vnode.el = document.createElement(vnode.type))

  // 相当于 vnode children
  // 有两种类型的值  字符串  和  数组
  const { children, shapeFlag } = vnode

  if (shapeFlag & ShapeFlages.TEXT_CHILDREN) {
    el.textContent = children
    // 判断 数组
  } else if (shapeFlag & ShapeFlages.ARRAY_CHILDREN) {
    // 其实还是 vnode
    // 所以调用 patch 方法 来遍历对和判断  是 组件类型 还是 元素类型
    mountChildren(vnode, el)
  }

  // 相当于 vnode props  -> 对象
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren (vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function processComponent (vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent (initialVnode: any, container) {
  const instance = createComponentInstance(initialVnode)

  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect (instance: any, vnode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  // vnode is element -> mountelement
  patch(subTree, container)
  vnode.el = subTree.el
}
