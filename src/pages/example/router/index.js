import Vue from 'vue'
import Router from 'vue-router'
import Init from '@/components/example/init'
import Example from '@/components/example/example'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Init',
      component: Init
    },
    {
      path: '/example',
      name: 'Example',
      component: Example
    }
  ]
})
