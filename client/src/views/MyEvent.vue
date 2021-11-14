<template>
  <div class="flex flex-col mt-28">
    <div class="text-gray-900 mb-8">
      <h1 class="text-5xl text-center filter drop-shadow-lg">My Event List</h1>
    </div>
    <section class="flex items-center flex-col" v-for="index in 10" :key="index">
      <MyEventCard />
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
