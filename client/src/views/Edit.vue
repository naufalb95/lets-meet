<template>
  <div v-on:click.stop class="flex justify-center items-center min-h-screen w-full my-28">
    <form @submit.prevent="" class="bg-white overflow-y-auto overflow-x-hidden shadow-md rounded px-12 py-12 w-1/2">
        <h1 class="text-center text-3xl text-blue-800 font-bold mb-12">Edit Event</h1>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Event Name</label>
          <input type="text" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none" placeholder="Yoga Training"/>
        </div>
        <div class="mt-1 mb-2 flex">
          <div class="w-3/4 mr-3 mb-4">
            <label class="text-center text-lg font-normal">Date</label>
            <input type="date" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none" />
          </div>
          <div class="w-3/4 mb-4">
            <label class="text-center text-lg font-normal">Time</label>
            <input type="time" value="00:00:00" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
          </div>
        </div>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Category</label>
          <select class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none">
            <option>AA</option>
            <option>AA</option>
            <option>AA</option>
            <option>AA</option>
            <option>AA</option>
          </select>
        </div>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Event Type</label>
          <select class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none">
            <option value="offline" selected>Offline</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Maximum Participants</label>
          <input type="number" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none" placeholder="50"/>
        </div>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Description</label>
          <textarea class="overflow-y-auto mb-2 px-2 py-2 rounded text-xs border shadow focus:outline-none block w-full" rows="8" placeholder="Type your event description here"/>
        </div>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Location</label>
          <form @submit.prevent="changeLocationHandler">
            <input type="text" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none mb-2" v-model="findPlace" placeholder="Grand Indonesia" />
          </form>
          <div id="maps" ref="googleMap" class="w-full border rounded shadow"></div>
        </div>
        <input type="submit" class="w-full text-white text-center bg-blue-600 hover:bg-blue-700 py-2 mt-4 rounded "/>
    </form>
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
import { mapActions } from 'vuex'

export default {
  name: 'Edit',
  data () {
    return {
      google: null,
      map: null,
      coords: {
        lat: 0,
        lng: 0
      },
      mapContainer: null,
      marker: null,
      findPlace: null
    }
  },
  async mounted () {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
      libraries: ['places']
    })

    navigator.geolocation.getCurrentPosition(this.showPosition)

    this.google = googleMapApi
    this.initializeMap()
  },
  methods: {
    ...mapActions(['findGooglePlaces']),
    initializeMap () {
      this.mapContainer = this.$refs.googleMap
    },
    showPosition (position) {
      this.coords.lat = position.coords.latitude
      this.coords.lng = position.coords.longitude

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
    changeLocationHandler () {
      const request = {
        query: this.findPlace,
        fields: ['name', 'geometry']
      }

      const service = new this.google.maps.places.PlacesService(this.map)

      service.findPlaceFromQuery(request, (res) => {
        const result = res[0]
        this.coords.lat = result.geometry.location.lat()
        this.coords.lng = result.geometry.location.lng()

        this.map.setCenter((new this.google.maps.LatLng(this.coords.lat, this.coords.lng)), 13)
        this.marker = new this.google.maps.Marker({
          position: {
            lat: this.coords.lat,
            lng: this.coords.lng
          },
          map: this.map
        })
      })

      console.log(this.coords)
    }
  }
}
</script>

<style scoped>
  #maps {
    height: 350px;
  }
</style>
