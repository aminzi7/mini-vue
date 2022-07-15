import { EMPTY_OBJ } from '../shared/index'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'
import { createAppAPI } from './createApp'
import { effect } from '../reactivity/effect'

export function createRenderer (options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render (vnode, container) {
    // patch 后面的递归
    patch(null, vnode, container, null)
  }

  // n1 旧
  // n2 新
  function patch (n1, n2, container, parentComponent) {
    // 判断是不是element
    // 是element就处理
    // 区分 element 和 组件
    const { type, shapeFlag } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break

      case Text:
        processText(n1, n2, container)
        break

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
          // isObject 判断对象
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break
    }
  }

  function processText (n1, n2: any, container: any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment (n1, n2: any, container: any, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  function processElement (n1, n2: any, container: any, parentComponent) {
    // init -> mount
    // 初始化
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }
  function patchElement (n1, n2, container, parentComponent) {
    console.log('patchElement')
    console.log('n1', n1)
    console.log('n2', n2)
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren (n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const { shapeFlag } = n2
    const c2 = n2.children

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren (children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  function patchProps (el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
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
      mountChildren(vnode.children, el, parentComponent)
    }

    // props
    const { props } = vnode
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }
    // canvs
    // el.x = 10

    // container.append(el);
    // addChild()
    hostInsert(el, container)
  }

  function mountChildren (children, container, parentComponent) {
    children.forEach(v => {
      patch(null, v, container, parentComponent)
    })
  }

  function processComponent (n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent (initialVNode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect (instance: any, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log('init')
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        // vnode is element -> mountelement
        patch(null, subTree, container, instance)

        initialVNode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log('update')
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree

        instance.subTree = subTree
        // console.log('current', subTree)
        // console.log('prevSubTree', prevSubTree)
        // vnode is element -> mountelement
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
