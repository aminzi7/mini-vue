export const extend = Object.assign

export const isObject = val => {
  return val !== null && typeof val === 'object'
}

export function hasChanged (newValue, value) {
  return !Object.is(newValue, value)
}

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key)

// 驼峰
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}
// TPP
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}
