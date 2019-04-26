import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    actgoodslist:[],
    para:""
}

const mutations={
    actgoodslist(state, data) {
        state.actgoodslist = data;
    },
    setpara(state,data){
        state.para=data
    }
}

export default new Vuex.Store({
    state,
    mutations
})