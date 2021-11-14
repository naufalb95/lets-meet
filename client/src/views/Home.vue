<template>
  <div class="relative">
    <div class="relative">
      <div class="w-2/3 py-48 bg-gray-100 rounded-r-xl shadow-xl mt-48 relative">
        <h1 class="text-4xl text-center mx-10 text-gray-800 w-5/6">
          Yoga. Data Science. Languages. People. You. Search Now. <span class="block mt-2 font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 filter drop-shadow-md text-6xl">Let's Meet!</span>
        </h1>
        <div class="flex justify-center mt-14 w-5/6">
          <input type="text" placeholder="Yoga Event" class="w-2/4 px-3 py-3 placeholder-gray-400 rounded-l-lg text-md border border-gray-300 focus:outline-none"/>
          <router-link to="/event" type="text" placeholder="Yoga Event" class="text-center border border-blue-600 px-8 py-3 rounded-r-lg text-base text-white shadow focus:outline-none bg-blue-600 hover:bg-blue-700 hover:border-blue-700">
            <font-awesome-icon icon="search" class="text-2xl"/>
          </router-link>
        </div>
      </div>
      <div class="mt-44 w-5/12 absolute top-0 right-0 rounded-xl overflow-hidden shadow-2xl">
        <img src="../assets/5235.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
