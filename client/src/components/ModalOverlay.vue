<template>
  <div @click="modalHandler" class="h-full w-screen absolute top-0 left-0 bg-gray-900 bg-opacity-70 z-10">
    <div class="h-screen w-screen relative z-10 flex justify-center items-center">
      <Login v-if="isModalLogin" />
      <Register v-if="isModalRegister" />
      <Leave v-if="isModalLeave" />
      <Delete v-if="isModalDelete" />
    </div>
  </div>
</template>

<script>
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Leave from '../views/Leave.vue'
import Delete from '../views/Delete.vue'

export default {
  name: 'ModalOverlay',
  components: {
    Login,
    Register,
    Leave,
    Delete
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
    },
    isModalLeave () {
      return this.$store.state.isModalLeave
    },
    isModalDelete () {
      return this.$store.state.isModalDelete
    }
  },
  methods: {
    modalHandler () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
      this.$store.commit('SET_IS_MODAL_SHOW_LEAVE', false)
      this.$store.commit('SET_IS_MODAL_SHOW_DELETE', false)
    }
  }
}
</script>
