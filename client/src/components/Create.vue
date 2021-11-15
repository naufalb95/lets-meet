<template>
  <div v-on:click.stop class="flex justify-center items-center">
    <form style="max-height: 95vh" @submit.prevent="" class="bg-white overflow-y-auto overflow-x-hidden shadow-md rounded px-12 py-12 justify-center items-center flex-col">
        <h1 class="text-center text-3xl text-blue-800 font-bold mb-12">Create Event</h1>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Event Name</label>
          <input type="text" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
        </div>
        <div class="mt-1 mb-2 flex">
          <div class="w-3/4 mr-3 mb-4">
            <label class="text-center text-lg font-normal">Date</label>
            <input type="date" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
          </div>
          <div class="w-3/4 mb-4">
            <label class="text-center text-lg font-normal">Time</label>
            <input type="time" value="00:00:00" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
          </div>
        </div>
        <div class="w-full mb-4">
          <label class="text-center text-lg font-normal">Location</label>
          <div id="maps" ref="googleMap" class="w-full border rounded shadow"></div>
        </div>
        <label class="text-center text-sm font-normal">Description</label><br>
        <textarea style="width: 50vw; height: 30vh; resize: none" class="overflow-y-auto mb-2 px-2 py-2 rounded text-xs border shadow focus:outline-none focus:ring"/><br>
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
          <label class="text-center text-lg font-normal">Maximum Participants</label>
          <input type="number" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
        </div>
        <input type="submit" class="w-full text-white text-center bg-blue-600 hover:bg-blue-700 py-2 mt-4 rounded "/>
    </form>
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  name: 'Create',
  data () {
    return {
      google: null,
      map: null,
      coords: {
        lat: 0,
        lng: 0
      },
      mapContainer: null,
      marker: null
    }
  },
  async mounted () {
    navigator.geolocation.getCurrentPosition(this.showPosition)
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: 'AIzaSyDOJpP-lEnakyV5PKJHbSOzKxTUu9oIeh0'
    })

    this.google = googleMapApi
    this.initializeMap()
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
  #maps {
    height: 350px;
  }
</style>
