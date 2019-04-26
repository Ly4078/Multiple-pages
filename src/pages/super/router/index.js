import Vue from 'vue'
import Router from 'vue-router'
import init from '@/components/super/super_init'
import Super from '@/components/super/super'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'init',
      component: init
    },{
      path: '/super',
      name: 'Super',
      component: Super
    }
  ]
})
