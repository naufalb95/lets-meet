<template>
  <div class="flex mt-16 flex-col">
    <div class="text-center" v-if="isLoading">
      <h1>Loading...</h1>
    </div>
    <div class="flex justify-center bg-white border-b border-gray-300 py-6" v-if="!isLoading">
      <div class="py-8 w-7/12">
        <h1 class="text-gray-600">{{ date }}</h1>
        <h1 class="text-blue-800 text-3xl font-bold">{{ eventDetail.event.name }}</h1>
        <h1 class="mt-2 text-gray-900">Hosted by</h1>
        <h1 class="text-gray-900 text-lg font-semibold">{{ eventDetail.eventOrganizer.username }}</h1>
      </div>
    </div>
    <div class="flex mt-10 justify-center">
      <div class="flex w-7/12 justify-center">
        <div class="w-2/3">
          <img :src="eventDetail.event.imgUrl" class="rounded-lg w-full">
          <h1 class="mt-4 text-xl font-semibold mb-4">Descriptions</h1>
          <h1 class="text-justify">{{ eventDetail.event.description }}</h1>
        </div>
        <div class="w-1/3 px-12">
          <div ref="detail" class="bg-white py-8 rounded-t-lg shadow-2xl flex items-center flex-col">
            <div class="mb-5">
              <h2 class="text-2xl font-semibold">Event Detail</h2>
            </div>
            <div class="flex w-full pl-6">
              <div class="flex justify-center items-center text-gray-600">
                <font-awesome-icon :icon="['far', 'clock']" class="mr-2 text-xl"/>
              </div>
              <div>
                <h3 class="block text-gray-800">{{ date }}</h3>
                <h3 class="block text-gray-800">{{ time }} WIB</h3>
              </div>
            </div>
            <div class="flex w-full pl-6">
              <div class="flex justify-center items-center text-gray-600">
                <font-awesome-icon :icon="['far', 'clock']" class="mr-2 text-xl"/>
              </div>
              <div>
                <h3 class="block text-gray-800">{{ eventDetail.event.location }}</h3>
              </div>
            </div>
            <div class="w-full flex items-center flex-col mt-12 px-6">
              <button @click="attendHandler" class="bg-blue-700 text-white px-3 py-1 rounded w-3/4 mt-2 text-lg font-semibold hover:bg-blue-800">Attend</button>
              <button @click="attendHandler" class="bg-blue-700 text-white px-3 py-1 rounded w-3/4 mt-2 text-lg font-semibold hover:bg-blue-800">Join Meet</button>
              <button @click="attendHandler" class="bg-white border border-red-700 text-red-700 px-3 py-1 rounded w-3/4 mt-2 text-lg font-semibold hover:bg-red-700 hover:border-red-700 hover:text-white">Leave Event</button>
            </div>
          </div>
          <div id="maps" ref="googleMap" class="bg-gray-700 rounded-b-lg shadow-2xl" v-if="eventDetail.event.location !== 'Online'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  name: 'Detail',
  data () {
    return {
      isLoading: true,
      isAttending: false,
      google: null,
      map: null,
      mapContainer: null,
      marker: null,
      coords: {
        lat: 0,
        lng: 0
      }
    }
  },
  computed: {
    ...mapState(['eventDetail', 'isLogin']),
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
    initializeMap () {
      this.mapContainer = this.$refs.googleMap
    },
    showPosition () {
      this.map = new this.google.maps.Map(
        this.mapContainer, {
          center: { lat: this.coords.lat, lng: this.coords.lng },
          zoom: 18
        }
      )

      this.marker = new this.google.maps.Marker({
        position: this.coords,
        map: this.map
      })
    },
    async attendHandler () {
      if (!this.isLogin) {
        this.$store.commit('SET_IS_MODAL_SHOW_LOGIN', true)
      } else {
        await this.attendEvent(this.$route.params.id)
      }
    }
  },
  async mounted () {
    await this.fetchEventDetail(this.$route.params.id)

    this.isLoading = false

    if (this.eventDetail.event.location === 'Online') {
      this.eventType = this.eventDetail.event.location
      this.$refs.detail.classList.add('rounded-b-lg')
    } else {
      const googleMapApi = await GoogleMapsApiLoader({
        apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
      })

      this.location = this.eventDetail.event.location
      this.eventType = 'offline'
      this.coords.lat = this.eventDetail.event.latitude
      this.coords.lng = this.eventDetail.event.longitude

      this.google = googleMapApi
      this.initializeMap()
      this.showPosition()
    }
  }
}
</script>

<style scoped>
  #maps {
    height: 250px;
  }
</style>
