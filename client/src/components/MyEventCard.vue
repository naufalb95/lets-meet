<template>
  <div class="w-5/12 px-10 py-8 bg-white rounded-xl mb-3 shadow-lg border border-white flex items-center">
    <div class="w-3/12">
      <div id="image" class="bg-gray-100 shadow-md border border-gray-300 rounded-lg">
        <img :src="event.event.imgUrl" :alt="event.event.name" class="object-contain w-full h-full"/>
      </div>
    </div>
    <div class="w-9/12">
      <div class="w-2/3">
        <h1 class="text-gray-700 text-md font-medium">{{ dateAndTime }}</h1>
        <h1 class="text-blue-900 font-semibold text-3xl filter drop-shadow-lg">{{ event.event.name }}</h1>
      </div>
      <div class="mt-6">
        <button @click.prevent="detailHandler" style="width: 100px" class="text-white py-1 font-semibold border border-blue-500 bg-blue-500 rounded hover:bg-blue-600 mr-2">
          Detail
        </button>
        <button @click.prevent="joinMeetHandler" v-if="(isAttending || isHost) && isStart && !isDone" style="width: 100px" class="text-white py-1 font-semibold border border-blue-500 bg-blue-500 rounded hover:bg-blue-600 mr-2">
          Join Meet
        </button>
        <button @click.prevent="leaveEventHandler" v-if="!isHost && isAttending && !isStart && !isDone" style="width: 100px" class="text-red-500 py-1 font-semibold border border-red-500 bg-white rounded hover:bg-red-500 hover:text-white mr-2">
          Leave
        </button>
        <button @click.prevent="editEventHandler" v-if="isHost && !isStart && !isDone" style="width: 100px" class="text-white py-1 font-semibold border border-yellow-500 bg-yellow-500 rounded hover:bg-yellow-600 mr-2">
          Edit
        </button>
        <button @click.prevent="doneEventHandler" v-if="isHost && isStart && !isDone" style="width: 100px" class="text-red-500 py-1 font-semibold border border-red-500 bg-white rounded hover:bg-red-500 hover:text-white mr-2">
          End Event
        </button>
        <button @click.prevent="deleteEventHandler" v-if="isHost && !isStart" style="width: 100px" class="text-red-500 py-1 font-semibold border border-red-500 bg-white rounded hover:bg-red-500 hover:text-white mr-2">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MyEventCard',
  data () {
    return {
      isAttending: false,
      isHost: false,
      isStart: false
    }
  },
  props: ['event'],
  methods: {
    ...mapActions(['fetchMyEvents', 'userLeaveEvent', 'deleteEvent', 'doneEvent']),
    detailHandler () {
      this.$router.push({ name: 'Detail', params: { id: this.event.event.id } })
    },
    async leaveEventHandler () {
      await this.userLeaveEvent(this.event.event.id)

      await this.fetchMyEvents()
    },
    async deleteEventHandler () {
      await this.deleteEvent(this.event.event.id)

      await this.fetchMyEvents()
    },
    async doneEventHandler () {
      await this.doneEvent(this.event.event.id)
    },
    joinMeetHandler () {
      this.$router.push('/event/' + this.event.event.id + '/meet')
    },
    editEventHandler () {
      this.$router.push({ name: 'Edit', params: { id: this.event.event.id } })
    }
  },
  computed: {
    ...mapState(['userId']),
    dateAndTime () {
      const timeZone = 'Asia/Jakarta'
      return format(utcToZonedTime(new Date(this.event.event.dateAndTime), timeZone), 'dd MMMM yyyy @ HH:mm')
    },
    isDone () {
      return this.event.event.isDone
    }
  },
  mounted () {
    if (+localStorage.getItem('user_id') === this.event.event.eventOrganizerId) this.isHost = true

    if (!this.isHost) this.isAttending = true

    const startDate = new Date(this.event.event.dateAndTime)
    const nowDate = new Date()

    if ((nowDate > startDate) && !this.event.event.isDone) this.isStart = true
  }
}
</script>

<style scoped>
  #image {
    height: 120px;
    width: 120px;
  }
</style>
