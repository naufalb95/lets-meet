<template>
  <div @click="hideEditModal" class="h-screen w-screen bg-gray-900 bg-opacity-70 absolute top-0 left-0 z-10 flex justify-center items-center">
    <Edit />
  </div>
</template>

<script>
import Edit from '../views/Edit.vue'
export default {
  name: 'ModalEdit',
  components: {
    Edit
  },
  methods: {
    hideEditModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_EDIT', false)
    }
  }
}
</script>
