<template>
  <div id="app" class="flex min-h-screen min-w-screen bg-gray-50 relative font-base overflow-x-hidden">
    <div class="bg-blue-400 h-screen w-screen absolute top-0 left-0 z-50 flex justify-start items-start text-white font-logo text-9xl pl-32 pt-24">
      Let's Meet
    </div>
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
import { mapActions, mapMutations } from 'vuex'

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
    }),
    ...mapActions(['fetchCategories'])
  },
  async mounted () {
    await this.fetchCategories()
    const token = localStorage.getItem('access_token')
    const userId = localStorage.getItem('user_id')

    if (token) this.mutateIsLogin(true)
    if (userId) this.mutateUserId(userId)
  }
}
</script>
