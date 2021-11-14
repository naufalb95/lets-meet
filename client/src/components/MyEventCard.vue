<template>
  <div class="w-5/12 px-4 py-4 border-b border-t border-indigo-900 flex">
  <div class="w-2/3">
    <h1 class="text-blue-900 font-medium">Sun, Nov 14 @14.00 WIB</h1>
    <h1 class="text-blue-900 font-bold">Event Name</h1>
  </div>
  <div class="w-1/3 flex justify-center">
    <button @click.prevent="showEditModal" style="width: 40%" class="text-white font-bold bg-blue-500 rounded p-2 mx-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50">Edit</button>
    <button style="width: 40%" @click.prevent="" class="text-white font-bold bg-blue-500 rounded p-2 mx-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50">Delete</button>
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
