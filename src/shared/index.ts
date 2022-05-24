export const extend = Object.assign

export const isObject = val => {
  return val !== null && typeof val === 'object'
}

export function hasChanged (newValue, value) {
  return !Object.is(newValue, value)
}
