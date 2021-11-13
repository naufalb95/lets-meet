<template>
  <nav>
    <div class="flex items-center justify-between flex-wrap bg-gradient-to-r from-blue-400 to-blue-600 py-2 px-10 fixed left-0 right-0 border-b-8 border-fuchsia-600">
      <div>
        <span class="cursor-default font-medium inline-block text-2xl text-white mr-1 ml-1">X</span>
        <router-link to="/" class="font-medium inline-block text-2xl text-white mr-1 ml-1">Let's Meet</router-link>
      </div>
      <ul>
        <li @click="showLoginModal" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-blue-900 mr-3 ml-3">Sign In</li>
        <li @click="showRegisterModal" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-blue-900 mr-3 ml-3">Sign Up</li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    showLoginModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', true)
    },
    showRegisterModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', true)
    }
  }
}
</script>
