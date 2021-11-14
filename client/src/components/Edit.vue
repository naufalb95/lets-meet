<template>
  <div v-on:click.stop class="flex justify-center items-center">
    <form style="max-height: 95vh" @submit.prevent="" class="overflow-y-auto overflow-x-hidden bg-gradient-to-r from-white to-blue-100 text-blue-900 shadow-md rounded px-8 py-6 justify-center items-center flex-col">
        <h1 class="text-center text-xl font-bold">Edit Event</h1>
        <label class="text-center text-sm font-normal">Name</label><br>
        <input type="text" style="width: 50vw" class="mt-1 mb-2 px-2 py-2 rounded text-xs border shadow focus:outline-none focus:ring"/><br>
        <div class="mt-1 mb-2 flex">
          <div style="width: 50%" class="mr-1">
            <label class="text-center text-sm font-normal">Date</label><br>
            <input style="width: 100%" type="date" class="px-2 py-2 rounded text-xs border shadow focus:outline-none focus:ring"/><br>
          </div>
          <div style="width: 50%" class="ml-1">
            <label class="text-center text-sm font-normal">Date</label><br>
            <input style="width: 100%" type="date" class="px-2 py-2 rounded text-xs border shadow focus:outline-none focus:ring"/><br>
          </div>
        </div>
        <label class="text-center text-sm font-normal">Location</label><br>
        <div style="width: 50vw; height: 30vh" class="mt-1 rounded border shadow"/><br>
        <label class="text-center text-sm font-normal">Description</label><br>
        <textarea style="width: 50vw; height: 30vh; resize: none" class="overflow-y-auto mb-2 px-2 py-2 rounded text-xs border shadow focus:outline-none focus:ring"/><br>
        <label class="text-center text-sm font-normal">Category</label><br>
        <select style="width: 50vw" class="mt-1 mb-2 px-2 py-2 rounded text-xs border shadow focus:outline-none focus:ring">
          <option>AA</option>
          <option>AA</option>
          <option>AA</option>
          <option>AA</option>
          <option>AA</option>
        </select><br>
        <label class="text-center text-sm font-normal">Maximum Participants</label><br>
        <input step="0.01" type="number" style="width: 50vw" class="mt-1 mb-2 px-2 py-2 rounded text-xs border shadow focus:outline-none focus:ring"/><br>
        <input type="submit" style="width: 50vw" class="text-white text-center bg-blue-600 hover:bg-blue-700 px-1 py-1 rounded "/>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Edit'
}
</script>

<style scoped>
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
