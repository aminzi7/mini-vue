import { isReactive, reactive } from '../reactive'
describe('reactive', () => {
  it('happy path', () => {
    let original = { foo: 1 }
    let observed = reactive(original)
    // 期望包装后和源对象不一样
    expect(observed).not.toBe(original)
    // 期望包装后某个属性的值和源对象一样
    expect(observed.foo).toBe(1)
    expect(isReactive(observed)).toBe(true)
    // 验证不是一个reactive
    expect(isReactive(original)).toBe(false)
  })
  test('nested reactive', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
