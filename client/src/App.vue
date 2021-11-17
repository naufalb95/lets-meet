<template>
  <div id="app" class="flex min-h-screen min-w-screen bg-gray-50 relative font-base overflow-x-hidden">
    <Navbar id="navbar" v-if="!isVideoConference" class="absolute z-10" />
    <router-view id="content" class="w-screen" />
    <div class="bottom-0 absolute">
      <Footer id="footer" v-if="!isVideoConference" />
    </div>
    <ModalOverlay v-if="isModalLogin || isModalRegister || isModalLeave || isModalDelete" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ModalOverlay from './components/ModalOverlay.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'App',
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
  components: {
    Navbar,
    Footer,
    ModalOverlay
  },
  methods: {
    ...mapMutations({
      mutateIsLogin: 'SET_IS_LOGIN',
      mutateUserId: 'SET_USER_ID'
    })
  },
  mounted () {
    const token = localStorage.getItem('access_token')
    const userId = localStorage.getItem('user_id')

    if (token) this.mutateIsLogin(true)
    if (userId) this.mutateUserId(userId)
  }
}
</script>
