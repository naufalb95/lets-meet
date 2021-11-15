<template>
  <div class="flex mt-16 flex-col">
    <div class="flex justify-center bg-white border-b border-gray-300 py-6">
      <div class="py-8 w-1/2">
        <h1 class="text-gray-600">{{ eventDetail.event.dateAndTime }}</h1>
        <h1 class="text-blue-800 text-3xl font-bold">{{ eventDetail.event.name }}</h1>
        <h1 class="mt-2 text-gray-900">Hosted by</h1>
        <h1 class="text-gray-900 text-lg font-semibold">{{ eventDetail.eventOrganizer.username }}</h1>
      </div>
    </div>
    <div class="flex mt-10 justify-center">
      <div class="flex w-1/2 justify-center">
        <div class="w-7/12">
          <img :src="eventDetail.event.imgUrl" class="rounded-lg">
          <h1 class="mt-4 text-xl font-semibold mb-4">Descriptions</h1>
          <h1 class="text-justify">{{ eventDetail.event.description }}</h1>
        </div>
        <div class="w-5/12 px-12">
          <div class="bg-white bg-opacity-75 p-8 rounded-t-lg shadow-2xl flex items-center flex-col">
            <div class="flex">
              <div class="flex justify-center items-center text-gray-600">
                <font-awesome-icon :icon="['far', 'clock']" class="mr-2 text-xl"/>
              </div>
              <div>
                <h1 class="block text-gray-800">{{ eventDetail.event.dateAndTime }}</h1>
                <h1 class="block text-gray-800">{{ eventDetail.event.dateAndTime }}</h1>
              </div>
            </div>
            <div class="w-full flex justify-center mt-4">
              <button class="bg-blue-700 text-white p-3 rounded w-1/2 mt-8 text-xl font-semibold hover:bg-blue-800">Attend</button>
            </div>
          </div>
          <div class="bg-gray-700 rounded-b-lg shadow-2xl py-48">Maps</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Detail',
  computed: {
    ...mapState(['eventDetail'])
  },
  methods: {
    ...mapActions(['fetchEventDetail'])
  },
  async created () {
    await this.fetchEventDetail(this.$route.params.id)
  }
}
</script>
