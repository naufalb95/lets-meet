<template>
  <router-link :to="{ name: 'Detail', params: { id: event.event.id }}" class="w-5/12 px-10 py-8 bg-white rounded-xl mb-3 shadow-lg border border-white hover:border-gray-400 flex flex-row">
  <div class="w-3/12">
    <div id="image" class="bg-gray-100 shadow-md border border-gray-300 rounded-lg">
      <img :src="event.event.imgUrl" :alt="event.event.name" class="object-contain w-full h-full"/>
    </div>
  </div>
  <div class="w-9/12">
    <h1 class="text-gray-900 font-semibold text-lg">{{ dateAndTime }} WIB</h1>
    <h1 class="text-blue-800 font-bold text-2xl">{{ event.event.name }}</h1>
    <h1 class="text-gray-900">{{ event.event.location }}</h1>
    <h1 class="text-gray-700 text-sm mt-3">{{ attendees }}/{{ event.event.maxParticipants }} Attendees</h1>
  </div>
  </router-link>
</template>

<script>
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export default {
  name: 'EventCard',
  props: ['event'],
  computed: {
    dateAndTime () {
      const timeZone = 'Asia/Jakarta'
      return format(utcToZonedTime(new Date(this.event.event.dateAndTime), timeZone), 'dd MMMM yyyy @ HH:mm')
    },
    attendees () {
      return this.event.event.participants?.length + 1
    }
  }
}
</script>

<style scoped>
  #image {
    height: 120px;
    width: 120px;
  }
</style>
