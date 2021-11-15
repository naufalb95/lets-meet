<template>
  <div @click.stop class="px-8 py-6 bg-white shadow-lg rounded-lg w-1/4 z-20 relative">
    <form @submit.prevent="loginSubmit" class="justify-center items-center flex-col flex">
        <h1 class="text-center text-3xl font-bold text-blue-800 mb-10">Sign In</h1>
        <div class="w-3/4 mb-4">
          <label class="text-center text-lg font-normal">Email Address</label>
          <input type="email" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/><br>
        </div>
        <div class="w-3/4 mb-4">
          <label class="text-center text-lg font-normal">Password</label>
          <input type="password" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/><br>
        </div>
        <input type="submit" value="Submit" class="w-3/4 mt-4 text-white text-center bg-blue-600 hover:bg-blue-700 px-2 py-3 shadow rounded cursor-pointer"/>
        <h1 class="text-center mt-12">Not a member? <span class="text-blue-700 font-bold cursor-pointer" @click="showRegisterModal">Sign Up</span></h1>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    showRegisterModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', true)
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
    },
    loginSubmit () {
      this.$store.commit('SET_IS_LOGIN', true)
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
    }
  }
}
</script>
