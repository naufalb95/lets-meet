<template>
  <div id="app" class="flex flex-col h-screen min-w-screen bg-gray-50 overflow-x-hidden relative font-base relative">
    <ModalOverlayLogin v-if="isModalLogin" />
    <ModalOverlayRegister v-if="isModalRegister" />
    <ModalOverlayCreate v-if="isModalCreate" />
    <ModalOverlayEdit v-if="isModalEdit" />
    <Navbar class="relative z-10"/>
    <!-- <router-view class="flex flex-col mt-14 mb-28 flex-grow z-10"/> -->
    <router-view />
    <Footer class="relative z-10"/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ModalOverlayLogin from './overlay/ModalOverlayLogin.vue'
import ModalOverlayRegister from './overlay/ModalOverlayRegister.vue'
import ModalOverlayCreate from './overlay/ModalOverlayCreate.vue'
import ModalOverlayEdit from './overlay/ModalOverlayEdit.vue'
export default {
  name: 'App',
  computed: {
    isModalLogin () {
      return this.$store.state.isModalLogin
    },
    isModalRegister () {
      return this.$store.state.isModalRegister
    },
    isModalCreate () {
      return this.$store.state.isModalCreate
    },
    isModalEdit () {
      return this.$store.state.isModalEdit
    }
  },
  components: {
    Navbar,
    Footer,
    ModalOverlayLogin,
    ModalOverlayRegister,
    ModalOverlayCreate,
    ModalOverlayEdit
  }
}
</script>
