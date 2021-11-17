<template>
  <div class="relative mb-96">
    <!-- 1 -->
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
      <div class="mt-44 w-5/12 absolute top-0 right-0 rounded-l-xl overflow-hidden shadow-2xl">
        <img src="../assets/5235.jpg" />
      </div>
    </div>
    <!-- 2 -->
    <div class="relative mb-96">
      <div class="mt-44 w-5/12 rounded-r-xl overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1674&q=80" />
      </div>
      <!-- mt-44 w-5/12 absolute top-0 right-0 rounded-l-xl overflow-hidden shadow-2xl -->
      <div class="w-8/12 absolute top-0 right-0 py-48 overflow-hidden bg-gray-100 rounded-l-xl shadow-xl mt-24">
        <h1 class="text-4xl text-center mx-10 text-gray-800 w-5/6">
          <span class="p-8 block mt-2 font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 filter drop-shadow-md text-6xl">
            Enabling the Hybrid Workforce
          </span>Explore how the Let's Meet platform seamlessly brings together remote and in-person teams, for work that goes wherever you do.
        </h1>
      </div>
    </div>
    <!-- 3 -->
    <div class="relative mb-24 mx-24">
      <div class="w-full pt-8 bg-gray-100 rounded-r-xl shadow-xl mt-48 relative">
        <h1 class="text-4xl text-center mx-48 text-gray-800 w-6/6">
          <span class="block mt-2 font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 filter drop-shadow-md text-6xl">Let's Meet Events is here!</span>Create virtual experiences that attendees will love. Get started with Let's Meet Events, an all-in-one platform to manage, host, and report on all of your virtual events.
        </h1>
      <div class="mt-20 w-5/12 bottom-0 left-0 rounded-b-xl overflow-hidden shadow-2xl w-full">
        <img style="height: 50vh; width: 100%; object-fit: cover" src="https://images.unsplash.com/photo-1531547255897-f400dc1b7de2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2874&q=80" />
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
