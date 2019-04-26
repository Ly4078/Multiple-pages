import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'


import Init from '@/components/replenish/init'
import replenish from '@/components/replenish/replenish_list'
import Lack from '@/components/replenish/lack'
import Addto from '@/components/replenish/addto'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Init',
      component: Init
    },{
      path: '/list',
      name: 'replenish',
      component: replenish
    },{
      path: '/lack',
      name: 'lack',
      component: Lack
    },{
      path: '/addto',
      name: 'addto',
      component: Addto
    }
  ]
})
