<template>
  <div class="w-5/12 px-10 py-8 bg-white rounded-xl mb-3 shadow-lg border border-white">
    <div class="w-2/3">
      <h1 class="text-gray-700 text-md font-medium">Sun, Nov 14 @ 14.00 WIB</h1>
      <h1 class="text-blue-900 font-semibold text-3xl filter drop-shadow-lg">Event Name</h1>
    </div>
    <div class="mt-6">
      <button @click.prevent="showEditModal" style="width: 100px" class="text-white py-1 font-semibold border border-blue-500 bg-blue-500 rounded hover:bg-blue-600 mr-2">Detail</button>
      <button @click.prevent="showEditModal" style="width: 100px" class="text-white py-1 font-semibold border border-yellow-500 bg-yellow-500 rounded hover:bg-yellow-600 mr-2">Edit</button>
      <button @click.prevent="showEditModal" style="width: 100px" class="text-red-500 py-1 font-semibold border border-red-500 bg-white rounded hover:bg-red-500 hover:text-white mr-2">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyEventCard',
  methods: {
    showEditModal () {
      this.$store.commit('SET_IS_MODAL_SHOW_EDIT', true)
    }
  }
}
</script>
