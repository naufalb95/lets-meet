<template>
  <div id="app" class="bg-white-ground flex flex-col h-screen min-w-screen bg-cover bg-no-repeat bg-center bg-fixed overflow-x-hidden relative">
    <ModalOverlayLogin v-if="isModalShow" />
    <ModalOverlayRegister v-if="isModalRegister" />
    <Navbar />
    <router-view class="flex flex-col mt-28 mb-28 flex-grow"/>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ModalOverlayLogin from './overlay/ModalOverlayLogin.vue'
import ModalOverlayRegister from './overlay/ModalOverlayRegister.vue'
export default {
  name: 'App',
  computed: {
    isModalShow () {
      return this.$store.state.isModalShow
    },
    isModalRegister () {
      return this.$store.state.isModalRegister
    }
  },
  components: {
    Navbar,
    Footer,
    ModalOverlayLogin,
    ModalOverlayRegister
  }
}
</script>
