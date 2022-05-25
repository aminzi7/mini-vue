import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: any
  constructor (getter) {
    this._getter = getter
    // effect 收集
    this._effect = new ReactiveEffect(getter, () => {
      // 不重复执行getter
      if (!this._dirty) {
        this._dirty = true
        getter
      }
    })
  }
  get value () {
    // 缓存 开关锁思想
    // dirty: true 开锁  dirty: false 关锁
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }

    return this._value
  }
}

export function computed (getter) {
  return new ComputedRefImpl(getter)
}
