<template>
  <div class="flex mt-16 flex-col">
    <div class="text-center" v-if="isLoading">
      <h1>Loading...</h1>
    </div>
    <div class="flex justify-center bg-white border-b border-gray-300 py-6" v-if="!isLoading">
      <div class="py-8 w-3/4">
        <h1 class="text-gray-600">{{ date }}</h1>
        <h1 class="text-blue-800 text-3xl font-bold">{{ eventDetail.event.name }}</h1>
        <h1 class="mt-2 text-gray-900">Hosted by</h1>
        <h1 class="text-gray-900 text-lg font-semibold">{{ eventDetail.eventOrganizer.username }}</h1>
      </div>
    </div>
    <div class="flex mt-10 justify-center">
      <div class="flex w-3/4 justify-center">
        <div class="w-2/3">
          <img :src="eventDetail.event.imgUrl" class="rounded-lg">
          <h1 class="mt-4 text-xl font-semibold mb-4">Descriptions</h1>
          <h1 class="text-justify">{{ eventDetail.event.description }}</h1>
        </div>
        <div class="w-1/3 px-12">
          <div class="bg-white py-8 rounded-t-lg shadow-2xl flex items-center flex-col">
            <div class="mb-5">
              <h2 class="text-2xl font-semibold">Event Detail</h2>
            </div>
            <div class="flex w-full pl-6">
              <div class="flex justify-center items-center text-gray-600">
                <font-awesome-icon :icon="['far', 'clock']" class="mr-2 text-xl"/>
              </div>
              <div>
                <h1 class="block text-gray-800">{{ date }}</h1>
                <h1 class="block text-gray-800">{{ time }} WIB</h1>
              </div>
            </div>
            <div class="w-full flex justify-center mt-4 px-6">
              <button class="bg-blue-700 text-white p-3 rounded w-full mt-8 text-xl font-semibold hover:bg-blue-800">Attend</button>
            </div>
          </div>
          <div id="maps" class="bg-gray-700 rounded-b-lg shadow-2xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export default {
  name: 'Detail',
  data () {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapState(['eventDetail']),
    date () {
      const timeZone = 'Asia/Jakarta'
      if (this.eventDetail.event?.dateAndTime) return format(utcToZonedTime(new Date(this.eventDetail.event.dateAndTime), timeZone), 'dd MMMM yyyy')
      else return ''
    },
    time () {
      const timeZone = 'Asia/Jakarta'
      if (this.eventDetail.event?.dateAndTime) return format(utcToZonedTime(new Date(this.eventDetail.event.dateAndTime), timeZone), 'HH:mm')
      else return ''
    }
  },
  methods: {
    ...mapActions(['fetchEventDetail', 'attendEvent']),
    async attendHandler () {
      await this.attendEvent(this.eventDetail.id)
    }
  },
  async created () {
    await this.fetchEventDetail(this.$route.params.id)

    this.isLoading = false
  }
}
</script>

<style scoped>
  #maps {
    height: 250px;
  }
</style>
