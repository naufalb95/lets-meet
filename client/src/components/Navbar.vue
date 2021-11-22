<template>
  <nav>
    <div class="flex items-center justify-between flex-wrap bg-blue-400 py-5 px-10 fixed left-0 right-0">
      <div>
        <router-link to="/" class="font-medium inline-block text-3xl text-white mr-1 ml-1 font-logo hover:text-gray-300">Let's Meet</router-link>
      </div>
      <ul>
        <router-link to="/event" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-gray-200 mr-3 ml-3">Event List</router-link>
        <li v-if="!isLogin" @click="showLoginModal" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-gray-200 mr-3 ml-3">Sign In</li>
        <li v-if="!isLogin" @click="showRegisterModal" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-gray-200 mr-3 ml-3">Sign Up</li>
        <router-link to="/event/create" v-if="isLogin" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-gray-200 mr-3 ml-3">Create Event</router-link>
        <router-link to="/myevent" v-if="isLogin" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-gray-200 mr-3 ml-3">My Event</router-link>
        <li v-if="isLogin" @click="logout" class="cursor-pointer font-medium inline-block text-basic text-white hover:text-gray-200 mr-3 ml-3">Logout</li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapState(['isLogin'])
  },
  methods: {
    ...mapMutations({
      mutateIsLogin: 'SET_IS_LOGIN',
      setUserId: 'SET_USER_ID'
    }),
    showLoginModal () {
      var show = document.getElementsByTagName('body')
      show[0].style.overflow = 'hidden'
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', true)
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', false)
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    showRegisterModal () {
      var show = document.getElementsByTagName('body')
      show[0].style.overflow = 'hidden'
      this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', false)
      this.$store.commit('SET_IS_MODAL_SHOW_REGISTER', true)
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    logout () {
      localStorage.clear()

      this.mutateIsLogin(false)
      this.setUserId(null)

      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
