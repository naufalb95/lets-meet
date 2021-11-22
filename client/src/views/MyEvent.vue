<template>
  <div class="flex flex-col mt-28 mb-96">
    <div class="text-gray-900 mb-8">
      <h1 class="text-5xl text-center filter drop-shadow-lg">My Event List</h1>
    </div>
    <section class="flex items-center flex-col" v-for="event in events" :key="event.id">
      <MyEventCard :event={event} />
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MyEventCard from '../components/MyEventCard.vue'

export default {
  name: 'Event',
  components: {
    MyEventCard
  },
  computed: {
    ...mapState(['events'])
  },
  methods: {
    ...mapActions(['fetchMyEvents'])
  },
  async created () {
    try {
      await this.fetchMyEvents()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
