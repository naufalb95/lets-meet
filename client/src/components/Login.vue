<template>
  <div v-on:click.stop class="flex justify-center items-center">
    <form  class="bg-gradient-to-r from-white to-blue-100 text-blue-900 shadow-md rounded px-8 py-6 justify-center items-center flex-col">
        <h1 class="text-center text-3xl font-bold">Sign In</h1>
        <label class="text-center text-xl font-normal">Email Address</label><br>
        <input type="email" style="width: 35vw" class="mt-2 mb-3 px-3 py-3 rounded text-sm border shadow focus:outline-none focus:ring"/><br>
        <label class="text-center text-xl font-normal">Password</label><br>
        <input type="password" style="width: 35vw" class="mt-2 mb-3 px-3 py-3 rounded text-sm border shadow focus:outline-none focus:ring"/><br>
        <input type="submit" style="width: 35vw" class="text-white text-center bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded "/>
        <h1 class="text-center mt-3">Not a member? <label class="text-blue-400">Sign Up</label></h1>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>
