<template>
  <div @click="hideCreateModal" class="h-screen w-screen bg-gray-900 bg-opacity-70 absolute top-0 left-0 z-10 flex justify-center items-center">
    <Create />
  </div>
</template>

<script>
import Create from '../views/Create.vue'
export default {
  name: 'ModalCreate',
  components: {
    Create
  },
  methods: {
    hideCreateModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_CREATE', false)
    }
  }
}
</script>
