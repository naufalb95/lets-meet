<template>
  <div v-on:click.stop class="flex justify-center items-center min-h-screen w-full my-28 mb-64">
    <form @submit.prevent="submitHandler" class="bg-white overflow-y-auto overflow-x-hidden shadow-md rounded px-12 py-12 w-1/2">
        <h1 class="text-center text-3xl text-blue-800 font-bold mb-12">Create Event</h1>
        <div class="w-full mb-4">
          <label id="name" class="text-center text-lg font-normal">Event Name</label>
          <input name="name" v-model="name" type="text" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none" placeholder="Yoga Training"/>
        </div>
        <div class="w-full mb-4">
          <label id="photo" class="text-center text-lg font-normal">Event Photo</label>
          <input @change="photoInputHandler" name="photo" type="file" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
        </div>
        <div class="mt-1 mb-2 flex">
          <div class="w-3/4 mr-3 mb-4">
            <label id="date" class="text-center text-lg font-normal">Date</label>
            <input name="date" v-model="date" type="date" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none" />
          </div>
          <div class="w-3/4 mb-4">
            <label id="time" class="text-center text-lg font-normal">Time</label>
            <input name="time" v-model="time" type="time" value="00:00:00" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none"/>
          </div>
        </div>
        <div class="w-full mb-4">
          <label id="category" class="text-center text-lg font-normal">Category</label>
          <select name="category" v-model="categoryId" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none">
            <option :value="category.id"  v-for="category in categories" :key="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="w-full mb-4">
          <label id="event-type" class="text-center text-lg font-normal">Event Type</label>
          <select name="event-type" @change="eventTypeHandler" v-model="eventType" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none">
            <option value="Offline" selected>Offline</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <div class="w-full mb-4">
          <label id="max-participants" class="text-center text-lg font-normal">Maximum Participants</label>
          <input name="max-participants" v-model="maxParticipants" type="number" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none" placeholder="50"/>
        </div>
        <div class="w-full mb-4">
          <label id="description" class="text-center text-lg font-normal">Description</label>
          <textarea name="description" v-model="description" class="overflow-y-auto mb-2 px-2 py-2 rounded text-xs border shadow focus:outline-none block w-full" rows="8" placeholder="Type your event description here"/>
        </div>
        <div class="w-full mb-4" ref="location">
          <label id="location" class="text-center text-lg font-normal">Location</label>
          <form @submit.prevent="changeLocationHandler">
            <input name="location" type="text" v-model="location" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none mb-2" placeholder="Grand Indonesia" />
          </form>
          <div id="maps" ref="googleMap" class="w-full border rounded shadow"></div>
        </div>
        <input type="submit" class="w-full text-white text-center bg-blue-600 hover:bg-blue-700 py-2 mt-4 rounded cursor-pointer"/>
    </form>
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Create',
  data () {
    return {
      google: null,
      map: null,
      mapContainer: null,
      marker: null,
      coords: {
        lat: 0,
        lng: 0
      },
      name: '',
      date: '',
      time: '',
      location: '',
      description: '',
      maxParticipants: 1,
      categoryId: '1',
      eventType: 'Offline',
      photo: null
    }
  },
  computed: {
    ...mapState(['categories'])
  },
  async created () {
    await this.fetchCategories()
    const date = new Date()
    const years = date.getFullYear()
    let months = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()

    if (months < 10) months = '0' + months
    if (day < 10) day = '0' + day
    if (hours < 10) hours = '0' + hours
    if (minutes < 10) minutes = '0' + minutes

    this.time = hours + ':' + minutes
    this.date = years + '-' + months + '-' + day
  },
  async mounted () {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: '',
      libraries: ['places']
    })

    navigator.geolocation.getCurrentPosition(this.showPosition)

    this.google = googleMapApi
    this.initializeMap()
  },
  methods: {
    ...mapActions(['createEvent', 'fetchCategories']),
    async submitHandler () {
      console.log(this.photo)
      const date = new Date(this.date)
      const time = this.time.split(':')
      const eventHours = time[0]
      const eventMinutes = time[1]

      this.dateAndTime = new Date(date.setHours(eventHours, eventMinutes))

      const payload = {
        name: this.name,
        dateAndTime: this.dateAndTime,
        description: this.description,
        maxParticipants: +this.maxParticipants,
        categoryId: +this.categoryId,
        imgUrl: this.photo
      }

      if (this.eventType === 'Offline') {
        payload.location = this.location
        payload.latitude = this.coords.lat
        payload.longitude = this.coords.lng
      } else {
        payload.location = this.eventType
      }

      console.log(payload)

      await this.createEvent(payload)

      this.$router.push({ name: 'MyEvent' })
    },
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
        query: this.location,
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
    },
    eventTypeHandler () {
      if (this.eventType === 'Online') this.$refs.location.classList.add('hidden')
      if (this.eventType === 'Offline') this.$refs.location.classList.remove('hidden')
    },
    photoInputHandler (e) {
      this.photo = e.target.files[0]

      console.log(this.photo)
    }
  }
}
</script>

<style scoped>
  #maps {
    height: 350px;
  }
</style>
