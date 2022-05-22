class ReactiveEffect {
  private _fn: any

  constructor (fn) {
    this._fn = fn
  }
  run () {
    activeEffect = this
    return this._fn()
  }
}

const targetMap = new Map()
export function track (target, key) {
  // target -> key -> dep
  // 没有就创建map
  // 有的话直接获取
  // 目的避开了重复收集的问题
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (const effect of dep) {
    effect.run()
  }
}
let activeEffect
export function effect (fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()

  return _effect.run.bind(_effect)
}
