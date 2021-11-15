<template>
  <div class="flex flex-col mt-24">
    <div class="mt-14 w-screen flex justify-center">
      <input type="text" placeholder="e.g. Yoga Event" class="w-2/6 px-3 py-3 placeholder-gray-400 rounded-l-lg text-sm border border-gray-300 shadow focus:outline-none"/>
      <button type="text" class="text-center border border-blue-600 px-8 py-3 rounded-r-lg text-white shadow focus:outline-none bg-blue-600 hover:bg-blue-700 hover:border-blue-700">
        <font-awesome-icon icon="search" class="text-xl"/>
      </button>
    </div>
    <div class="mt-4 w-screen flex justify-center mb-8">
      <select class="text-center mx-4 py-2 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="1">Damar</option>
        <option value="2">Gio</option>
        <option value="3">Nopal</option>
        <option value="4">Frengki</option>
        <option value="5">Far</option>
      </select>
      <select class="text-center mx-4 py-2 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="1">Damar</option>
        <option value="2">Gio</option>
        <option value="3">Nopal</option>
        <option value="4">Frengki</option>
        <option value="5">Far</option>
      </select>
      <select class="text-center mx-4 py-2 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="1">Damar</option>
        <option value="2">Gio</option>
        <option value="3">Nopal</option>
        <option value="4">Frengki</option>
        <option value="5">Far</option>
      </select>
      <select class="text-center mx-4 py-2 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="1">Damar</option>
        <option value="2">Gio</option>
        <option value="3">Nopal</option>
        <option value="4">Frengki</option>
        <option value="5">Far</option>
      </select>
    </div>
    <section class="flex items-center flex-col" v-for="event in events" :key="event.id">
      <EventCard v-bind:event={event} />
    </section>
  </div>
</template>

<script>
import EventCard from '../components/EventCard.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Event',
  components: {
    EventCard
  },
  computed: {
    ...mapState(['events'])
  },
  methods: {
    ...mapActions(['fetchEvents'])
  },
  async created () {
    await this.fetchEvents()
    console.log(this.events)
  }
}
</script>
