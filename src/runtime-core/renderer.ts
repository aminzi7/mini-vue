import { isObject } from '../shared/index'
import { createComponentInstance, setupComponent } from './component'

export function render (vnode, container) {
  // path 后面的递归
  path(vnode, container)
}

function path (vnode, container) {
  // 判断是不是element
  // 是element就处理
  // 区分 element 和 组件
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
    // isObject 判断对象
  } else if (isObject(vnode.type)) {
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
  const el = document.createElement(vnode.type)

  // 相当于 vnode children
  // 有两种类型的值  字符串  和  数组
  const { children } = vnode
  if (typeof children === 'string') {
    el.textContent = children
    // 判断 数组
  } else if (Array.isArray(children)) {
    // 其实还是 vnode
    // 所以调用 path 方法 来遍历对和判断  是 组件类型 还是 元素类型
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
    path(v, container)
  })
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
