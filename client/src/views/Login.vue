<template>
  <div @click.stop class="px-8 py-6 bg-white shadow-lg rounded-lg w-1/4 z-20 relative">
    <form @submit.prevent="submitHandler" class="justify-center items-center flex-col flex">
        <div class="flex justify-around w-full">
          <h1></h1>
          <h1 class="text-center text-3xl font-bold text-blue-800 mb-10">Sign In</h1>
          <h1 @click="closeHandler" class="cursor-pointer"><font-awesome-icon :icon="['fas', 'times']" class="mr-2 text-3xl"/></h1>
        </div>
        <div class="w-3/4 mb-4">
          <label id="email" class="text-center text-lg font-normal">Email Address</label>
          <input name="email" v-model="email" type="email" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/><br>
        </div>
        <div class="w-3/4 mb-4">
          <label id="email" class="text-center text-lg font-normal">Password</label>
          <input name="password" v-model="password" type="password" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/><br>
        </div>
        <input type="submit" value="Submit" class="w-3/4 mt-4 text-white text-center bg-blue-600 hover:bg-blue-700 px-2 py-3 shadow rounded cursor-pointer"/>
        <h1 class="text-center mt-12">Not a member? <span class="text-blue-700 font-bold cursor-pointer" @click="showRegisterModal">Sign Up</span></h1>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['loginUser']),
    showRegisterModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', true)
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
    },
    async submitHandler () {
      try {
        const payload = {
          email: this.email,
          password: this.password
        }
        await this.loginUser(payload)
        this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
        this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
      } catch (error) {
        console.log(error)
      }
    },
    closeHandler () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
      var show = document.getElementsByTagName('body')
      show[0].style.overflow = 'hidden'
    }
  }
}
</script>
