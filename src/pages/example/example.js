// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import example from './example.vue'

import router from './router'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from './store/store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(example)
})

