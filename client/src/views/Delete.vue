<template>
  <div @click.stop class="px-8 py-6 bg-white shadow-lg rounded-lg w-1/4 z-20 relative">
    <h1 class="text-center font-semibold text-xl">Are you sure to delete this event?</h1>
    <div class="flex mt-8">
      <button @click.prevent="deletez" class="w-1/2 text-center bg-blue-600 p-2 text-white rounded-xl mx-4 hover:bg-white hover:text-blue-600 border-2 border-blue-600">Yes</button>
      <button @click.prevent="cancelDelete" class="w-1/2 text-center bg-red-600 p-2 text-white rounded-xl mx-4 hover:bg-white hover:text-red-600 border-2 border-red-600">No</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Delete',
  methods: {
    async cancelDelete () {
      await this.$store.commit('SET_IS_MODAL_SHOW_DELETE', false)
      var show = document.getElementsByTagName('body')
      show[0].style.overflow = 'visible'
    },
    async deletez () {
      await this.$store.commit('SET_DELETE_EVENT', true)
      var show = document.getElementsByTagName('body')
      show[0].style.overflow = 'visible'
    }
  }
}
</script>

<style>

</style>
