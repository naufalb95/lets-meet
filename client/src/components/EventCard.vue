<template>
  <router-link :to="{ name: 'Detail', params: { id: event.event.id }}" class="w-5/12 px-10 py-8 bg-white rounded-xl mb-3 shadow-lg border border-white hover:border-gray-400">
    <h1 class="text-gray-900 font-semibold text-lg">{{ dateAndTime }} WIB</h1>
    <h1 class="text-blue-800 font-bold text-2xl">{{ event.event.name }}</h1>
    <h1 class="text-gray-900">{{ event.event.location }}</h1>
    <h1 class="text-gray-700 text-sm mt-3">0/{{ event.event.maxParticipants }} Attendees</h1>
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
    }
  }
}
</script>
