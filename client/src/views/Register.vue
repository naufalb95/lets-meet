<template>
  <div @click.stop class="px-8 py-6 bg-white shadow-lg rounded-lg w-1/3 z-20 relative">
    <form @submit.prevent="submitHandler" class="justify-center items-center flex-col flex">
        <h1 class="text-center text-3xl font-bold text-blue-800 mb-10">Sign Up</h1>
        <div class="w-3/4 mb-4">
          <label id="username" class="text-center text-lg font-normal">Username</label>
          <input type="text" name="username" v-model="username" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
        </div>
        <div class="w-3/4 mb-4">
          <label id="email" class="text-center text-lg font-normal">Email Address</label>
          <input type="email" name="email" v-model="email" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
        </div>
        <div class="w-3/4 mb-4">
          <label id="password" class="text-center text-lg font-normal">Password</label>
          <input type="password" name="password" v-model="password" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
        </div>
        <div class="w-3/4 mb-4">
          <label id="confirm-password" class="text-center text-lg font-normal">Confirm Password</label>
          <input type="password" name="confirm-password" v-model="confirmPassword" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
        </div>
        <input type="submit" value="Submit" class="w-3/4 mt-4 text-white text-center bg-blue-600 hover:bg-blue-700 px-2 py-3 shadow rounded cursor-pointer"/>
        <h1 class="text-center mt-12">Already a member? <span class="text-blue-700 font-bold cursor-pointer">Sign In</span></h1>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Register',
  data () {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    ...mapActions(['registerUser']),
    showLoginModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', true)
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
    },
    async submitHandler () {
      if (this.password !== this.confirmPassword) console.log('salah!')
      else {
        const payload = {
          username: this.username,
          email: this.email,
          password: this.password
        }

        await this.registerUser(payload)

        this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', true)
        this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
      }
    }
  }
}
</script>
