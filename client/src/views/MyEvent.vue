<template>
  <div class="flex flex-col mt-28">
    <div class="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-800 mb-8">
      <h1 class="text-5xl text-center">My Event List</h1>
    </div>
    <section class="flex items-center flex-col" v-for="index in 10" :key="index">
      <MyEventCard></MyEventCard>
    </section>
  </div>
</template>

<script>
import MyEventCard from '../components/MyEventCard.vue'
export default {
  name: 'Event',
  components: {
    MyEventCard
  }
}
</script>
