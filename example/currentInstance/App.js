import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
  name: 'App',
  render () {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick () {
          console.log('click')
        },
        onMousedown () {
          console.log('onMousedown')
        }
      },
      [
        h('div', {}, this.msg),
        h(Foo, {
          count: 1
        })
      ]
      // 'hi, ' + this.msg
      // string
      // 'hi mini-vue'
      // arr
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
    )
  },

  setup () {
    return {
      msg: 'mini-vue-haha'
    }
  }
}
