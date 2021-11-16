<template>
  <div id="app" class="flex min-h-screen min-w-screen bg-gray-50 relative font-base overflow-x-hidden">
    <!-- <ModalOverlayLogin v-if="isModalLogin" /> -->
    <!-- <ModalOverlayRegister v-if="isModalRegister" /> -->
    <!-- <ModalOverlayCreate v-if="isModalCreate" /> -->
    <!-- <ModalOverlayEdit v-if="isModalEdit" /> -->
    <Navbar id="navbar" v-if="!isVideoConference" class="absolute z-10" />
    <router-view id="content" class="w-screen mb-64" />
    <div class="bottom-0 absolute">
      <Footer id="footer" v-if="!isVideoConference" />
    </div>
    <ModalOverlay v-if="isModalLogin || isModalRegister || isModalCreate || isModalEdit" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
// import ModalOverlayLogin from './overlay/ModalOverlayLogin.vue'
// import ModalOverlayRegister from './overlay/ModalOverlayRegister.vue'
// import ModalOverlayCreate from './overlay/ModalOverlayCreate.vue'
// import ModalOverlayEdit from './overlay/ModalOverlayEdit.vue'
import ModalOverlay from './components/ModalOverlay.vue'

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
    },
    isVideoConference () {
      return this.$store.state.isVideoConference
    }
  },
  components: {
    Navbar,
    Footer,
    // ModalOverlayLogin,
    // ModalOverlayRegister,
    // ModalOverlayCreate,
    // ModalOverlayEdit,
    ModalOverlay
  }
}
</script>
