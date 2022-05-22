class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  constructor (fn, public scheduler?) {
    this._fn = fn
  }
  run () {
    activeEffect = this
    return this._fn()
  }
  stop () {
    // stop 性能优化，每次调用的stop的时候，都会比较频繁
    if (this.active) {
      cleanupEffect(this)
      this.active = false
    }
  }
}

function cleanupEffect (effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
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
  activeEffect.deps.push(dep)
}

export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

let activeEffect
export function effect (fn, options: any = {}) {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop (runner) {
  runner.effect.stop()
}
