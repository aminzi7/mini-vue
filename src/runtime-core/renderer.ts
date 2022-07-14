import { isObject } from '../shared/index'
import { ShapeFlages } from '../shared/ShapeFlages'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render (vnode, container) {
  // patch 后面的递归
  patch(vnode, container, null)
}

function patch (vnode, container, parentComponent) {
  // 判断是不是element
  // 是element就处理
  // 区分 element 和 组件
  const { type, shapeFlag } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break

    case Text:
      processText(vnode, container)
      break

    default:
      if (shapeFlag & ShapeFlages.ELEMENT) {
        processElement(vnode, container, parentComponent)
        // isObject 判断对象
      } else if (shapeFlag & ShapeFlages.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
      break
  }
}

function processText (vnode: any, container: any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processFragment (vnode, container, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}
function processElement (vnode: any, container: any, parentComponent) {
  // init -> mount
  // 初始化
  mountElement(vnode, container, parentComponent)
}

// 初始化
function mountElement (vnode: any, container: any, parentComponent) {
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
    mountChildren(vnode, el, parentComponent)
  }

  // 相当于 vnode props  -> 对象
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    console.log(key)
    const isOn = key => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.append(el)
}

function mountChildren (vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}

function processComponent (vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function mountComponent (initialVnode: any, container, parentComponent) {
  const instance = createComponentInstance(initialVnode, parentComponent)

  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect (instance: any, vnode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  // vnode is element -> mountelement
  patch(subTree, container, instance)
  vnode.el = subTree.el
}
