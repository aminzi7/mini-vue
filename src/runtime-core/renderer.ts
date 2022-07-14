import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'
import { createAppAPI } from './createApp'

export function createRenderer (options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert
  } = options

  function render (vnode, container) {
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
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
          // isObject 判断对象
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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

  function processFragment (vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent)
  }

  function processElement (vnode: any, container: any, parentComponent) {
    // init -> mount
    // 初始化
    mountElement(vnode, container, parentComponent)
  }

  // 初始化
  function mountElement (vnode: any, container: any, parentComponent) {
    //canvas
    // new Element()
    const el = (vnode.el = hostCreateElement(vnode.type))

    // 相当于 vnode children
    // 有两种类型的值  字符串  和  数组
    const { children, shapeFlag } = vnode

    // children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
      // 判断 数组
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 其实还是 vnode
      // 所以调用 patch 方法 来遍历对和判断  是 组件类型 还是 元素类型
      mountChildren(vnode, el, parentComponent)
    }

    // props
    const { props } = vnode
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, val)
    }
    // canvs
    // el.x = 10

    // container.append(el);
    // addChild()
    hostInsert(el, container)
  }

  function mountChildren (vnode, container, parentComponent) {
    vnode.children.forEach(v => {
      patch(v, container, parentComponent)
    })
  }

  function processComponent (vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent (initialVNode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect (instance: any, initialVNode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    // vnode is element -> mountelement
    patch(subTree, container, instance)

    initialVNode.el = subTree.el
  }

  return {
    createApp: createAppAPI(render)
  }
}
