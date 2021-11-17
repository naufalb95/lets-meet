<template>
  <div v-on:click.stop class="flex justify-center items-center min-h-screen w-full my-28 mb-64">
    <form @submit.prevent="submitHandler" class="bg-white overflow-y-auto overflow-x-hidden shadow-md rounded px-12 py-12 w-1/2">
        <h1 class="text-center text-3xl text-blue-800 font-bold mb-12">Edit Event</h1>
        <div class="w-full mb-4">
          <label id="name" class="text-center text-lg font-normal">Event Name</label>
          <input name="name" v-model="name" type="text" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none" placeholder="Yoga Training"/>
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
            <option :value="category.id" v-for="category in categories" :key="category.id">
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
         <div class="w-full mb-4">
          <label id="description" class="text-center text-lg font-normal">Add Picture</label><br>
          <img :src="imgUrlDisplay" :alt="name" class="object-contain w-6/12 h-6/12 pb-3"/>
          <p class="text-s font-normal pb-3">Edit Image File: <span v-if="imgUrl">{{ imgUrl.name }}</span></p>
          <label class="w-64 flex flex-col items-center px-4 py-6 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-400 hover:text-white text-blue-400 ease-linear transition-all duration-150">
          <i class="fas fa-cloud-upload-alt fa-3x"></i>
          <span class="mt-2 text-base leading-normal">Select a file</span>
          <input @change="getPicture($event)" type="file" class="hidden" />
          </label>
        </div>
        <div class="w-full mb-4" ref="location">
          <label id="location" class="text-center text-lg font-normal">Location</label>
          <form @submit.prevent="changeLocationHandler">
            <input name="location" type="text" class="w-full px-3 py-3 mt-1 rounded text-sm border shadow focus:outline-none mb-2" v-model="location" placeholder="Grand Indonesia" />
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
  name: 'Edit',
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
      imgUrl: '',
      imgUrlDisplay: '',
      location: '',
      description: '',
      maxParticipants: 0,
      categoryId: 1,
      eventType: 'offline',
      photo: null
    }
  },
  computed: {
    ...mapState(['eventDetail', 'categories'])
  },
  async created () {
    await this.fetchCategories()
  },
  async mounted () {
    try {
      await this.fetchEventDetail(this.$route.params.id)
      await this.fetchCategories()
      const googleMapApi = await GoogleMapsApiLoader({
        apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
      })
      const date = new Date(this.eventDetail.event.dateAndTime)
      const years = date.getFullYear()
      let months = date.getMonth() + 1
      let day = date.getDate()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      if (months < 10) months = '0' + months
      if (day < 10) day = '0' + day
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      this.name = this.eventDetail.event.name
      this.imgUrlDisplay = this.eventDetail.event.imgUrl
      this.time = hours + ':' + minutes
      this.date = years + '-' + months + '-' + day
      this.description = this.eventDetail.event.description
      this.maxParticipants = this.eventDetail.event.maxParticipants
      this.categoryId = this.eventDetail.event.categoryId
      if (this.eventDetail.event.location === 'Online') {
        this.eventType = this.eventDetail.event.location
      } else {
        this.location = this.eventDetail.event.location
        this.eventType = 'Offline'
        this.coords.lat = +this.eventDetail.event.latitude
        this.coords.lng = +this.eventDetail.event.longitude
      }
      this.google = googleMapApi
      this.initializeMap()
      this.showPosition()
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapActions(['fetchEventDetail', 'editEvent', 'fetchCategories']),
    getPicture (event) {
      this.imgUrl = event.target.files[0]
    },
    async submitHandler () {
      try {
        const date = new Date(this.date)
        const time = this.time.split(':')
        const eventHours = time[0]
        const eventMinutes = time[1]
        this.dateAndTime = new Date(date.setHours(eventHours, eventMinutes))
        const form = {
          name: this.name,
          dateAndTime: this.dateAndTime,
          description: this.description,
          maxParticipants: +this.maxParticipants,
          categoryId: +this.categoryId
        }
        if (this.eventType === 'Offline') {
          form.location = this.location
          form.latitude = this.coords.lat
          form.longitude = this.coords.lng
        } else {
          form.location = this.eventType
        }
        const payload = {
          form,
          eventId: this.$route.params.id
        }
        await this.editEvent(payload)
        this.$router.push({ name: 'MyEvent' })
      } catch (error) {
        console.log(error)

      }
    },
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
    }
  }
}
</script>

<style scoped>
  #maps {
    height: 350px;
  }
</style>
