import { hasChanged, isObject } from '../shared'
import { trackEffects, triggerEffects, isTraking } from './effect'
import { reactive } from './reactive'

class Reflmp {
  private _value: any
  private dep
  private _rawvalue: any
  constructor (value) {
    // {} -> reactive
    this._rawvalue = value
    this._value = convert(value)

    this.dep = new Set()
  }
  get value () {
    trackRefvalue(this)

    return this._value
  }
  set value (newValue) {
    // 对比
    if (hasChanged(newValue, this._value)) {
      this._rawvalue = newValue
      this._value = convert(newValue)

      triggerEffects(this.dep)
    }
  }
}

function convert (value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefvalue (ref) {
  if (isTraking()) {
    trackEffects(ref.dep)
  }
}

export function ref (value) {
  return new Reflmp(value)
}
