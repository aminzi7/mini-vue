import { extend } from '../shared'

// activeEffect 保存的是实例  ReactiveEffect 的this
let activeEffect
let shouldTrack

export class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  constructor (fn, public scheduler?) {
    this._fn = fn
  }
  run () {
    // 收集中
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    // 重置中
    shouldTrack = false
    return result
  }
  stop () {
    // stop 性能优化，每次调用的stop的时候，都会比较频繁
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect (effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

const targetMap = new Map()
export function track (target, key) {
  // activeEffect 有可能是一个underfine
  if (!isTraking()) return
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

  // 不重复收集
  trackEffects(dep)
}

export function trackEffects (dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTraking () {
  return shouldTrack && activeEffect !== undefined
}

export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)

  triggerEffects(dep)
}

export function triggerEffects (dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect (fn, options: any = {}) {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)
  // _effect.onStop = options.onStop
  // Object.assign(_effect, options)
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export function stop (runner) {
  runner.effect.stop()
}
