export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type
  }

  return component
}

export function setupComponent (instance) {
  // init props
  // init solt
  // 处理setup 返回值 函数？ 对象？
  setupStatefulComponent(instance)
}

function setupStatefulComponent (instance: any) {
  // get state
  const Component = instance.type

  const { setup } = Component
  if (setup) {
    const setupResult = setup()

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
