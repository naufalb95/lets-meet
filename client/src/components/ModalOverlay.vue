<template>
  <div @click="modalHandler" class="min-h-screen w-screen bg-gray-900 bg-opacity-70 absolute top-0 left-0 z-10 flex justify-center items-center">
    <Login v-if="isModalLogin" />
    <Register v-if="isModalRegister" />
    <Create v-if="isModalCreate" />
  </div>
</template>

<script>
import Login from './Login.vue'
import Register from './Register.vue'
import Create from '../views/Create.vue'

export default {
  name: 'ModalOverlay',
  components: {
    Login,
    Register,
    Create
  },
  computed: {
    isModalLogin () {
      return this.$store.state.isModalLogin
    },
    isModalRegister () {
      return this.$store.state.isModalRegister
    },
    isModalCreate () {
      return this.$store.state.isModalCreate
    },
    isModalEdit () {
      return this.$store.state.isModalEdit
    },
    isVideoConference () {
      return this.$store.state.isVideoConference
    }
  },
  methods: {
    modalHandler () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
      this.$store.commit('SET_IS_MODAL_SHOW_CREATE', false)
      this.$store.commit('SET_IS_MODAL_SHOW_EDIT', false)
    }
  }
}
</script>
