import { hasChanged, isObject } from '../shared'
import { trackEffects, triggerEffects, isTraking } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  private dep
  private _rawvalue: any
  private __v_isRef = true
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
  return new RefImpl(value)
}

export function isRef (ref) {
  return !!ref.__v_isRef
}

export function unRef (ref) {
  return isRef(ref) ? ref._value : ref
}

export function proxyRefs (objectWithRefs) {
  // return isRef(ref) ? ref._value : ref
  return new Proxy(objectWithRefs, {
    get (target, key) {
      return unRef(Reflect.get(target, key))
    },
    set (target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}
