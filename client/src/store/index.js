import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isModalLogin: false,
    isModalRegister: false,
    isModalCreate: false,
    isModalEdit: false,
    isLogin: false,
    isVideoConference: false
  },
  mutations: {
    SET_IS_MODAL_SHOW_LOGIN (state, payload) {
      state.isModalLogin = payload
    },
    SET_IS_MODAL_SHOW_REGISTER (state, payload) {
      state.isModalRegister = payload
    },
    SET_IS_MODAL_SHOW_CREATE (state, payload) {
      state.isModalCreate = payload
    },
    SET_IS_MODAL_SHOW_EDIT (state, payload) {
      state.isModalEdit = payload
    },
    SET_IS_LOGIN (state, payload) {
      state.isLogin = payload
    },
    SET_IS_VIDEO_CONFERENCE (state, payload) {
      state.isVideoConference = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
