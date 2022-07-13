import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup () {
    return {}
  },
  render () {
    const foo = h('p', {}, 'foo')

    console.log(this.$slots)
    // 1.插槽
    // 2.具名插槽
    // 3.作用域插槽
    const age = 18
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age
      }),
      foo,
      renderSlots(this.$slots, 'footer')
    ])
  }
}
