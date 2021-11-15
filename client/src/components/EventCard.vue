<template>
  <router-link to="/event/1" class="w-5/12 px-10 py-8 bg-white rounded-xl mb-3 shadow-lg border border-white hover:border-gray-400">
    <h1 class="text-gray-900 font-semibold text-lg">{{ event.event.dateAndTime }}</h1>
    <h1 class="text-blue-800 font-bold text-2xl">{{ event.event.name }}</h1>
    <h1 class="text-gray-900">Event Location</h1>
    <h1 class="text-gray-700 text-sm mt-3">0/{{ event.event.maxParticipants }} Attendees</h1>
  </router-link>
</template>

<script>
export default {
  name: 'EventCard',
  props: ['event']
}
</script>
