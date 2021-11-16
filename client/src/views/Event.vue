<template>
  <div class="flex flex-col mt-24">
    <div class="mt-14 w-screen flex justify-center">
      <form @submit.prevent="submitHandler" class="w-full flex justify-center">
        <input type="text" v-model="eventName" placeholder="e.g. Yoga Event" class="w-2/6 px-3 py-3 placeholder-gray-400 rounded-l-lg text-sm border border-gray-300 shadow focus:outline-none"/>
        <button type="text" class="text-center border border-blue-600 px-8 py-3 rounded-r-lg text-white shadow focus:outline-none bg-blue-600 hover:bg-blue-700 hover:border-blue-700">
        <font-awesome-icon icon="search" class="text-xl"/>
      </button>
      </form>
    </div>
    <div class="mt-4 w-screen flex justify-center mb-8">
      <select name="day" v-model="day" @change="dropdownFilterHandler" class="text-center mx-4 py-3 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="">Any Day</option>
        <option value="today">Today</option>
        <option value="tomorrow">Tomorrow</option>
        <option value="thisWeek">This Week</option>
        <option value="nextWeek">Next Week</option>
      </select>
      <select name="location" v-model="location" @change="dropdownFilterHandler"  class="text-center mx-4 py-3 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="">Any Type</option>
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
      </select>
      <select name="distance" v-model="distance" @change="dropdownFilterHandler"  class="text-center mx-4 py-3 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="">Any Distance</option>
        <option value="1">1 KM</option>
        <option value="2">2 KM</option>
        <option value="5">5 KM</option>
        <option value="10">10 KM</option>
        <option value="25">25 KM</option>
        <option value="50">50 KM</option>
        <option value="100">100 KM</option>
        <option value="200">200 KM</option>
      </select>
      <select name="category" v-model="category" @change="dropdownFilterHandler"  class="text-center mx-4 py-3 px-6 text-gray-800 shadow-lg rounded-xl focus:outline-none bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer">
        <option value="">Any Category</option>
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
  data () {
    return {
      eventName: '',
      day: '',
      location: '',
      distance: '',
      category: '',
      latitude: 0,
      longitude: 0,
      filter: {}
    }
  },
  components: {
    EventCard
  },
  computed: {
    ...mapState(['events'])
  },
  methods: {
    ...mapActions(['fetchEvents']),
    async dropdownFilterHandler (e) {
      let { name, value } = e.target

      if (!value) delete this.filter[name]
      else if (name === 'type') name = 'location'
      else {
        this.filter = {
          ...this.filter,
          [name]: value
        }
      }

      console.log(this.filter)

      const payload = { ...this.filter }

      await this.fetchEvents(payload)
    },
    async submitHandler () {
      const payload = {
        eventName: this.eventName
      }

      await this.fetchEvents(payload)
    }
  },
  async created () {
    await this.fetchEvents()
  }
}
</script>
