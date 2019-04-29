import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

import goods_list from '@/components/goods/goods_list'
import successpay from '@/components/goods/successpay'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'goods_list',
      component: goods_list
    },{
      path: '/successpay',
      name: 'successpay',
      component: successpay
    },
  ]
})
