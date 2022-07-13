import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {}
  }
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent (instance) {
  initProps(instance, instance.vnode.props)
  // initSolts
  // 处理setup 返回值 函数？ 对象？
  setupStatefulComponent(instance)
}

function setupStatefulComponent (instance: any) {
  // get state
  const Component = instance.type
  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  const { setup } = Component
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult (instance, setupResult: any) {
  // 先对象
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup (instance: any) {
  const Component = instance.type

  // if (Component.render) {
  //   instance.render = Component.render
  // }
  instance.render = Component.render
}
