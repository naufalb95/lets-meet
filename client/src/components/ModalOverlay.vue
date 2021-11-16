<template>
  <div @click="modalHandler" class="h-full w-screen absolute top-0 left-0 bg-gray-900 bg-opacity-70 z-10">
    <div class="h-screen w-screen relative z-10 flex justify-center items-center">
      <Login v-if="isModalLogin" />
      <Register v-if="isModalRegister" />
    </div>
  </div>
</template>

<script>
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

export default {
  name: 'ModalOverlay',
  components: {
    Login,
    Register
  },
  computed: {
    isModalLogin () {
      return this.$store.state.isModalLogin
    },
    isModalRegister () {
      return this.$store.state.isModalRegister
    },
    isVideoConference () {
      return this.$store.state.isVideoConference
    }
  },
  methods: {
    modalHandler () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
    }
  }
}
</script>
