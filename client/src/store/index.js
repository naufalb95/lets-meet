import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isModalShow: false,
    isModalRegister: false
  },
  mutations: {
    SET_IS_MODAL_SHOW_LOGIN (state, payload) {
      state.isModalShow = payload
    },
    SET_IS_MODAL_SHOW_REGISTER (state, payload) {
      state.isModalRegister = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
