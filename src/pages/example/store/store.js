import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
 
export default new Vuex.Store({
  state:{
    count:0,
    openid:"",
    wxback:{}
  },
  mutations:{
    increment:state => state.count ++,
    decrement:state => state.count --,
    setopenid(state, data) {
      state.openid = data;
    },
    setwxback(state, data) {
      state.wxback = data;
    }
  }
})