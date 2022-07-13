import { camelize, toHandlerKey } from '../shared'

export function emit (instance, event, ...args) {
  console.log('emit', event)
  const { props } = instance

  const handerName = toHandlerKey(camelize(event))
  const handler = props[handerName]
  handler && handler(...args)
}
