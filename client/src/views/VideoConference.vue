<template>
  <div id='app' class='min-h-screen w-screen bg-gray-900 relative'>
    <div id='content' class='text-white pl-5 flex items-center'>
      <div id='video_container' class='flex-grow h-full p-2'>
        <div class='bg-gray-800 bg-opacity-80 w-full h-full rounded-lg text-black flex items-center justify-center relative'>
          <div id='main_video' class='w-full relative z-10'></div>
          <div class="absolute top-0 left-0 h-full w-full flex justify-center items-center text-gray-300">Waiting for host to share their screen or cam</div>
        </div>
      </div>
      <div id='part_container' class='flex-grow-0 h-full p-2 overflow-y-scroll overflow-x-hidden'>
        <div id='video_part' class='flex-grow-0 relative' v-for="user of inMeetParticipants" :key="user.id">
          <div :id="user.id" class='participants-video bg-gray-800 h-full rounded-lg text-black mb-3 overflow-hidden relative'>
            <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center text-gray-300">asd</div>
            <div class="absolute top-0 right-0 z-10 w-full h-full flex justify-end items-start  text-gray-300 pr-2 pt-3">
              <font-awesome-icon :icon="['fas', 'microphone-alt-slash']" class="mr-2 text-red-500"/>
            </div>
            <div class="absolute top-0 left-0 z-20 w-full h-full flex justify-start items-end text-gray-300">
              <div class="px-4 bg-black bg-opacity-50 w-full overflow-hidden truncate">
                <span class="text-sm">{{ user.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div id='part_chat' class='flex-grow-0 h-full p-2'>
        <div class='bg-white h-full rounded-lg text-black'>
          <div class='p-3 overflow-auto flex flex-col h-full'>
            <div class="border-b border-gray-400 pb-2 font-semibold text-gray-700">
              Chat Participants
            </div>
            <div class="flex-grow h-full">
              <div class="my-2">
                <div><span class="font-semibold text-sm">asd</span> <span class="italic text-xs text-gray-400">asd</span></div>
                <div class="text-sm">ASd</div>
              </div>
            </div>
            <form class="flex flex-grow-0">
              <div class='w-5/6'>
                <textarea type="text" id='chat_message' placeholder='Start talking with everyone!' class='p-1 border border-r-0 border-gray-300 w-full h-full rounded-l-md outline-none overflow-y-scroll overflow-x-hidden' rows="2">
                </textarea>
              </div>
              <div class='w-1/6'>
                <button class='p-1 border border-gray-300 w-full h-full rounded-r-md outline-none border-l-0 bg-white'>
                  <font-awesome-icon :icon="['fas', 'paper-plane']" class="mr-2 text-2xl text-gray-600"/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div id='bottom_row' class='text-white pl-5 flex items-center'>
      <button class='mx-3'>Screen Share</button>
      <button class='mx-3'>Stop Screen Share</button>
      <button class='mx-3'>Open Cam</button>
      <button class='mx-3'>Close Cam</button>
      <button class='mx-3'>Mute</button>
      <button class='mx-3'>Unmute</button>
      <button class='mx-3' @click="leaveHandler">Leave Room</button>
    </div>
    <div class='absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-80 flex justify-center items-center hidden' v-if='false'>
      <div class='bg-white rounded w-3/12 py-12 px-8 flex justify-center items-center flex-col'>
        <h1 class='text-2xl text-center'>Already well dressed? Let's join by clicking the button!</h1>
        <div>
          <button class='bg-blue-800 text-white px-6 py-2 rounded-md mt-6 mr-3 btn hover:bg-blue-900' >Join</button>
          <button class='border border-red-800 text-red-800 px-6 py-2 rounded-md mt-6 hover:bg-red-800 hover:text-white btn'>Leave</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AgoraRTC from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'
import { mapActions, mapState } from 'vuex'
import { utcToZonedTime, format } from 'date-fns-tz'

export default {
  name: 'VideoConference',
  data () {
    return {
      eventId: null,
      options: {
        appId: ''
      },
      settings: {
        channelName: '',
        uid: null
      },
      chat: {
        client: null,
        channel: null,
        messages: []
      },
      video: {
        client: null
      },
      inMeetParticipants: [],
      screenClient: null
    }
  },
  computed: {
    ...mapState(['eventDetail', 'token'])
  },
  methods: {
    ...mapActions(['getChatToken', 'getVideoToken', 'fetchEventDetail']),
    leaveHandler () {
      this.inMeetParticipants.push({ userId: this.inMeetParticipants.length + 2 })
      console.log('masuk')
    },
    async initializeChat () {
      // ! Get Chat Token
      const payload = { ...this.settings }

      await this.getChatToken(payload)

      this.chat.client = AgoraRTM.createInstance(this.options.appId)

      await this.chat.client.login({
        uid: this.settings.uid.toString(),
        token: this.token.chat
      })

      this.chat.channel = this.chat.client.createChannel(this.settings.channelName)

      await this.chat.channel.join()

      // ! Chat Event Handler
      // * If there is a new message handler
      this.chat.channel.on('ChannelMessage', (message, uid) => {
        this.chat.messages.push({
          message: message.text,
          name: uid,
          time: format(utcToZonedTime(new Date(), 'Asia/Jakarta'), 'kk:mm')
        })
      })
    },
    async initializeVideoCall () {
      this.video.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

      const payload = {
        ...this.settings
      }

      // ! Get Video Call Token
      await this.getVideoToken(payload)

      await this.video.client.join(this.options.appId, this.settings.channelName, this.token.video, this.settings.uid)

      // ! Video Call Event Handler
      // ! When a user join video call
      this.video.client.on('user-published', async (user, mediaType) => {
        await this.video.client.subscribe(user, mediaType)

        let userIdx = this.inMeetParticipants.findIndex(participant => participant.id === user.uid)

        if (userIdx === -1) {
          const remoteUser = {
            id: user.uid
          }

          this.inMeetParticipants.push(remoteUser)

          userIdx = this.inMeetParticipants.findIndex(participant => participant.id === user.uid)
        }

        const participant = this.inMeetParticipants[userIdx]

        if (mediaType === 'video') {
          participant.videoTrack = user.videoTrack
        }

        if (mediaType === 'audio') {
          participant.audioTrack = user.audioTrack
        }

        if (participant.audioTrack && participant.videoTrack) {
          participant.videoTrack.play(user.uid.toString())
          participant.audioTrack.play()
        }
      })

      // ! When a user left video call
      this.video.client.on('user-unpublished', async (user) => {
        this.inMeetParticipants = this.inMeetParticipants.filter(participant => participant.id !== user.uid)
      })
    }
  },
  async created () {
    // ! Get Event Detail
    this.eventId = +this.$route.params.id

    await this.fetchEventDetail(this.eventId)

    // ! Set App ID, Channel Name, and uid
    this.options.appId = process.env.VUE_APP_AGORA_API_KEY
    this.settings.channelName = this.eventDetail.event.id.toString()
    this.settings.uid = +localStorage.getItem('user_id')

    // ! Initialize Chat RTM
    await this.initializeChat()

    // ! Initialize Video Call RTC
    await this.initializeVideoCall()
  }
}
</script>

<style scoped>
  #content {
    height: calc(100vh - 60px);
  }

  #bottom_row {
    height: 60px;
  }

  #part_container {
    width: 300px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  #part_container::-webkit-scrollbar {
    display: none;
  }

  #main_video {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  #main_video::-webkit-scrollbar {
    display: none;
  }

  .part_video_container::-webkit-scrollbar {
    display: none;
  }

  #part_chat {
    width: 325px;
  }

  .participants-video {
    height: 168.75px;
  }

  #chat_message {
    resize: none;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  #chat_message::-webkit-scrollbar {
    display: none;
  }

  .btn {
    width: 100px;
  }
</style>
