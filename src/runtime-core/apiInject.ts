import { getCurrentInstance } from './component'

export function provide (key, value) {
  // 存
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    let { provides } = currentInstance

    const parentPeovides = currentInstance.parent.provides
    // init 改写原型链
    if (provides === parentPeovides) {
      provides = currentInstance.provides = Object.create(parentPeovides)
    }

    provides[key] = value
  }
}

export function inject (key, defaultValue) {
  // 取
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  }
}
