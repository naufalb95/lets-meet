<template>
  <div @click="hideRegisterModal" class="h-screen w-screen bg-gray-900 bg-opacity-70 absolute top-0 left-0 z-10 flex justify-center items-center">
    <Register />
  </div>
</template>

<script>
import Register from '../components/Register.vue'
export default {
  name: 'ModalRegister',
  components: {
    Register
  },
  methods: {
    hideRegisterModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
    }
  }
}
</script>
