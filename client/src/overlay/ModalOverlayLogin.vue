<template>
  <div @click="hideLoginModal" class="h-screen w-screen bg-gray-900 bg-opacity-70 absolute top-0 left-0 z-20 flex justify-center items-center">
    <Login />
  </div>
</template>

<script>
import Login from '../components/Login.vue'
export default {
  name: 'ModalLogin',
  components: {
    Login
  },
  methods: {
    hideLoginModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
    }
  }
}
</script>
