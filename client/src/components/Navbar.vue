<template>
  <nav>
    <div class="flex items-center justify-between flex-wrap bg-gray-800 py-5 px-10 fixed left-0 right-0">
      <div>
        <router-link to="/" class="font-medium inline-block text-3xl text-white mr-1 ml-1 font-logo">Let's Meet</router-link>
      </div>
      <ul>
        <li v-if="!isLogin" @click="showLoginModal" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-blue-900 mr-3 ml-3">Sign In</li>
        <li v-if="!isLogin" @click="showRegisterModal" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-blue-900 mr-3 ml-3">Sign Up</li>
        <li v-if="isLogin" @click="showCreateModal" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-blue-900 mr-3 ml-3">Create Event</li>
        <router-link to="/myevent" v-if="isLogin" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-blue-900 mr-3 ml-3">My Event</router-link>
        <li v-if="isLogin" @click="logout" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-blue-900 mr-3 ml-3">Logout</li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    }
  },
  methods: {
    showLoginModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', true)
    },
    showRegisterModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', true)
    },
    showCreateModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_CREATE', true)
    },
    logout () {
      this.$store.commit('SET_IS_LOGIN', false)
    }
  }
}
</script>
