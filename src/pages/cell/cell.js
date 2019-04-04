import Vue from 'Vue'
import cell from './cell.vue'

import router from './router'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from './store/store'

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(cell)
})
