import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Inquire from '@/components/replenish/Inquire'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Inquire',
      component: Inquire
    }
  ]
})
