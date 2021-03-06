<template>
  <div id='app' class='min-h-screen w-screen bg-gray-900 relative'>
    <div id='content' class='text-white pl-5 flex items-center'>
      <div id='video_container' class='flex-grow h-full p-2'>
        <div class='bg-gray-800 bg-opacity-80 w-full h-full rounded-lg text-black flex items-center justify-center relative'>
          <div id='main_video' class='w-full relative z-10'></div>
          <div class="absolute top-0 left-0 h-full w-full flex justify-center items-center text-gray-300">Waiting for host to share their screen or cam</div>
        </div>
      </div>
      <div id='part_container' class='flex-grow-0 h-full p-2 hidden'>
        <div id='video_part' class='flex-grow-0 h-full overflow-x-hidden overflow-y-scroll part_video_container relative'>
          <div id='host_video' class='participants-video bg-white h-full rounded-lg text-black mb-3 overflow-hidden hidden'></div>
          <div id='local_video' class='participants-video bg-gray-800 h-full rounded-lg text-black mb-3 overflow-hidden relative'>
            <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center text-gray-300">{{ this.options.uid }}</div>
            <div class="absolute top-0 left-0 pl-4 pb-2 filter drop-shadow-lg z-20 w-full h-full flex justify-start items-end text-gray-300 hidden" ref="local_video_username">{{ this.options.uid }}</div>
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
              <div v-for="(data, index) in messages" :key="index" class="my-2">
                <div><span class="font-semibold text-sm">{{ data.name }}</span> <span class="italic text-xs text-gray-400">{{ data.time }}</span></div>
                <div class="text-sm">{{ data.message }}</div>
              </div>
            </div>
            <form class="flex flex-grow-0" @submit.prevent="createNewMessage">
              <div class='w-5/6'>
                <textarea type="text" @keydown="createNewMessage" id='chat_message' placeholder='Start talking with everyone!' class='p-1 border border-r-0 border-gray-300 w-full h-full rounded-l-md outline-none overflow-y-scroll overflow-x-hidden' v-model="message" rows="2">
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
      <button @click='shareScreenHandler' class='mx-3' v-if='!isScreenShare && isHost'>Screen Share</button>
      <button @click='stopScreenShareHandler' class='mx-3' v-if='isScreenShare && isHost'>Stop Screen Share</button>
      <button @click='openCamHandler' class='mx-3' v-if='!isOpenCam'>Open Cam</button>
      <button @click='closeCamHandler' class='mx-3' v-if='isOpenCam'>Close Cam</button>
      <button @click='muteHandler' class='mx-3' v-if='!isMuted'>Mute</button>
      <button @click='unmuteHandler' class='mx-3' v-if='isMuted'>Unmute</button>
      <button @click='leaveHandler' class='mx-3'>Leave Room</button>
    </div>
    <div class='absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-80 flex justify-center items-center' v-if='!isJoined'>
      <div class='bg-white rounded w-3/12 py-12 px-8 flex justify-center items-center flex-col'>
        <h1 class='text-2xl text-center'>Already well dressed? Let's join by clicking the button!</h1>
        <div>
          <button class='bg-blue-800 text-white px-6 py-2 rounded-md mt-6 mr-3 btn hover:bg-blue-900' @click='joinHandler'>Join</button>
          <button class='border border-red-800 text-red-800 px-6 py-2 rounded-md mt-6 hover:bg-red-800 hover:text-white btn'>Leave</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AgoraRTC from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'
import { mapActions, mapState, mapMutations } from 'vuex'
import { utcToZonedTime, format } from 'date-fns-tz'

export default {
  name: 'VideoConference',
  data () {
    return {
      isJoined: false,
      isMuted: true,
      isOpenCam: false,
      isHost: false,
      myId: null,
      hostId: null,
      isHostPresent: false,
      screenId: null,
      isScreenShare: false,
      participantsId: [],
      hostVideoTrack: null,
      rtc: {
        localAudioTrack: null,
        localVideoTrack: null,
        localScreenTrack: null,
        client: null,
        camClient: null,
        screenClient: null
      },
      options: {
        appId: process.env.VUE_APP_AGORA_API_KEY,
        channel: '',
        uid: null
      },
      channelChat: null,
      messages: [],
      message: ''
    }
  },
  methods: {
    ...mapActions(['getChatToken', 'getVideoToken', 'getScreenToken', 'fetchEventDetail']),
    ...mapMutations({
      setIsVideoConference: 'SET_IS_VIDEO_CONFERENCE'
    }),
    async createNewMessage (e) {
      const checkEmptyMsg = this.message.trim()
      if (this.channelChat != null && (e.type === 'submit' || (e.type === 'keydown' && e.keyCode === 13)) && checkEmptyMsg) {
        await this.channelChat.sendMessage({ text: this.message })

        this.messages.push({
          message: this.message,
          name: this.options.uid,
          time: format(utcToZonedTime(new Date(), 'Asia/Jakarta'), 'kk:mm')
        })

        this.message = ''
      }
    },
    async joinHandler () {
      await this.getChatToken({ uid: this.options.uid, channelName: this.options.channel })

      const appId = this.options.appId
      const client = AgoraRTM.createInstance(appId)
      const options = {
        uid: this.options.uid,
        token: this.token.chat
      }

      await client.login(options)

      this.channelChat = client.createChannel(this.options.channel)

      await this.channelChat.join()

      this.channelChat.on('ChannelMessage', (message, uid) => {
        this.messages.push({
          message: message.text,
          name: uid,
          time: format(utcToZonedTime(new Date(), 'Asia/Jakarta'), 'kk:mm')
        })
      })

      // * Video
      await this.getVideoToken({ uid: +this.myId, channelName: this.options.channel })

      await this.rtc.client.join(appId, this.options.channel, this.token.video, +this.myId)
      this.isJoined = true
      this.isMuted = true
      this.isOpenCam = false
    },
    videoResizeHandler () {
      const localVideoContainer = document.getElementById('main_video')

      const playerWidth = localVideoContainer.offsetWidth
      localVideoContainer.style.height = `${playerWidth / 16 * 9}px`
    },
    async leaveHandler () {
      if (this.rtc.localAudioTrack) this.rtc.localAudioTrack.close()
      if (this.rtc.localVideoTrack) this.rtc.localVideoTrack.close()
      if (this.rtc.localScreenTrack) this.rtc.localScreenTrack.close()

      this.rtc.client.remoteUsers.forEach(() => {
        const playerContainer = document.getElementById('video_container')
        playerContainer && playerContainer.remove()
      })

      await this.rtc.client.leave()

      this.setIsVideoConference(false)

      this.$router.push({ name: 'Home' })
    },
    async openCamHandler () {
      if (!this.rtc.localVideoTrack) {
        this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
        await this.rtc.client.publish(this.rtc.localVideoTrack)

        let container = null

        if (this.hostId === this.options.uid && !this.screenId) {
          container = document.getElementById('main_video')
          const localVidDiv = document.getElementById('local_video')
          localVidDiv.className = ''
          this.$refs.local_video_username.classList.add('hidden')

          container.style.height = `${container.offsetWidth / 16 * 9}px`
        } else {
          // * Jika bukan host, cam local masuk ke sini
          container = document.getElementById('local_video')
          const partChatDiv = document.getElementById('part_container')
          partChatDiv.classList.remove('hidden')
          this.$refs.local_video_username.classList.remove('hidden')

          container.className = 'participants-video bg-gray-800 h-full rounded-lg text-black mb-3 overflow-hidden relative'
        }

        this.rtc.localVideoTrack.play(container)
      } else {
        await this.rtc.client.publish(this.rtc.localVideoTrack)
        this.rtc.localVideoTrack.setMuted(false)
      }

      this.isOpenCam = true
    },
    async closeCamHandler () {
      this.rtc.localVideoTrack.close(true)
      await this.rtc.client.unpublish(this.rtc.localVideoTrack)

      const partChatDiv = document.getElementById('part_container')
      const remoteUsers = this.rtc.client.remoteUsers

      if (this.hostId === this.options.uid) {
        if (this.isScreenShare && remoteUsers.length === 1) {
          partChatDiv.classList.add('hidden')
        }
      }

      this.rtc.localVideoTrack = null
      this.isOpenCam = false
      this.$refs.local_video_username.classList.add('hidden')
    },
    async unmuteHandler () {
      if (!this.rtc.localAudioTrack) {
        this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        await this.rtc.client.publish(this.rtc.localAudioTrack)
      } else {
        this.rtc.localAudioTrack.setMuted(false)
      }

      this.isMuted = false
    },
    async muteHandler () {
      this.rtc.localAudioTrack.setMuted(true)
      this.isMuted = true
    },
    async shareScreenHandler () {
      await this.getScreenToken({ channelName: this.options.channel })

      let container = null

      this.rtc.screenClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

      await this.rtc.screenClient.join(this.options.appId, this.options.channel, this.token.screen)

      this.rtc.localScreenTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1',
        optimizationMode: 'detail'
      })

      await this.rtc.screenClient.publish(this.rtc.localScreenTrack)

      let localVideoContainer = null

      localVideoContainer = document.getElementById('main_video')

      localVideoContainer.style.width = '100%'
      const playerWidth = localVideoContainer.offsetWidth
      localVideoContainer.style.height = `${playerWidth / 16 * 9}px`

      this.rtc.localScreenTrack.play(localVideoContainer)

      this.isScreenShare = true

      if (this.rtc.localVideoTrack) {
        container = document.getElementById('local_video')

        container.className = 'participants-video bg-gray-800 h-full rounded-lg text-black mb-3 overflow-hidden relative'
        this.$refs.local_video_username.classList.remove('hidden')

        this.rtc.localVideoTrack.play(container)
      }
    },
    async stopScreenShareHandler () {
      let container = null

      await this.rtc.screenClient.unpublish(this.rtc.localScreenTrack)

      this.rtc.localScreenTrack.close(true)

      this.rtc.localScreenTrack = null
      await this.rtc.screenClient.leave()

      this.isScreenShare = false

      if (this.rtc.localVideoTrack) {
        container = document.getElementById('main_video')
        const localVidDiv = document.getElementById('local_video')
        localVidDiv.className = ''
        this.$refs.local_video_username.classList.add('hidden')

        this.rtc.localVideoTrack.play(container)
      }
    }
  },
  async created () {
    this.setIsVideoConference(true)

    await this.fetchEventDetail(this.$route.params.id)

    this.hostId = this.eventDetail.event.eventOrganizerId.toString()
    this.options.channel = this.eventDetail.event.id.toString()
    this.participantsId = this.eventDetail.participants.map((p) => p.userId)

    if (localStorage.getItem('user_id') === this.hostId) {
      this.options.uid = this.eventDetail.eventOrganizer.username
      this.myId = this.eventDetail.eventOrganizer.id.toString()
    } else {
      const userIdx = this.eventDetail.participants.findIndex((p) => {
        return p.userId === +localStorage.getItem('user_id')
      })
      const uid = this.eventDetail.participants[userIdx]
      console.log(this.eventDetail)

      this.options.uid = uid.User.username
      this.options.uid = 'test'
      this.myId = uid.userId.toString()
    }

    if (this.hostId === this.myId) {
      this.isHost = true
      this.isHostPresent = true
    }
  },
  computed: {
    ...mapState(['token', 'eventDetail'])
  },
  async mounted () {
    window.addEventListener('resize', this.videoResizeHandler)

    this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

    if (this.host) {
      const localVidDiv = document.getElementById('local_video')

      localVidDiv.className = ''
    } else {
      const partChatDiv = document.getElementById('part_container')

      partChatDiv.classList.remove('hidden')
    }

    this.rtc.client.on('user-published', async (user, mediaType) => {
      await this.rtc.client.subscribe(user, mediaType)

      const userRemotes = this.rtc.client.remoteUsers

      const partChatDiv = document.getElementById('part_container')

      const isParticipant = this.participantsId.includes(user.uid)

      if (!isParticipant && (user.uid !== +this.hostId)) this.screenId = user.uid

      if ((userRemotes.length !== 0 && userRemotes[0].uid !== this.screenId) || (this.screenId && this.rtc.localVideoTrack)) {
        partChatDiv.classList.remove('hidden')
      }

      if (userRemotes.length === 0) {
        partChatDiv.classList.add('hidden')
      }

      let videoContainer = null

      videoContainer = document.getElementById('video_part')

      // const remotePlayerContainer = document.createElement('div')
      // remotePlayerContainer.id = user.uid.toString()
      // remotePlayerContainer.style.width = '100%'
      // remotePlayerContainer.style.height = '168.76px'
      // remotePlayerContainer.className = 'participants-video bg-gray-800 h-full rounded-lg text-black mb-3 overflow-hidden relative'

      // const remotePlayerUserBackground = document.createElement('div')
      // remotePlayerUserBackground.className = 'absolute top-0 left-0 w-full h-full flex justify-center items-center text-gray-300'
      // remotePlayerUserBackground.innerText = this.options.uid

      // remotePlayerContainer.append(remotePlayerUserBackground)
      // videoContainer.append(remotePlayerContainer)

      if (user.uid === this.hostId) this.isHostPresent = true

      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack

        if (user.uid === this.screenId && !this.isHost) {
          // * Jika client adalah screen share
          const mainContainer = document.getElementById('main_video')
          console.log('CEK MASUK SINI HOST')

          mainContainer.style.width = '100%'
          const playerWidth = mainContainer.offsetWidth
          mainContainer.style.height = `${playerWidth / 16 * 9}px`

          remoteVideoTrack.play(mainContainer)

          if (this.hostVideoTrack) {
            const hostContainer = document.getElementById('host_video')

            hostContainer.classList.remove('hidden')
            this.hostVideoTrack.play(hostContainer)
          }
        }

        if (user.uid === +this.hostId) {
          // * Jika client adalah host
          if (this.screenId) {
            console.log('CEK MASUK SINI HOST 2')
            const hostContainer = document.getElementById('host_video')
            this.hostVideoTrack = remoteVideoTrack

            hostContainer.classList.remove('hidden')

            this.hostVideoTrack.play(hostContainer)
          } else {
            const mainContainer = document.getElementById('main_video')
            this.hostVideoTrack = remoteVideoTrack

            mainContainer.style.width = '100%'
            const playerWidth = mainContainer.offsetWidth
            mainContainer.style.height = `${playerWidth / 16 * 9}px`

            this.hostVideoTrack.play(mainContainer)
          }
        }

        if (user.uid !== this.screenId && user.uid !== this.hostId) {
          // * Jika client bukanlah screen dan host, melainkan participants
          const remotePlayerContainer = document.createElement('div')
          remotePlayerContainer.id = user.uid.toString()
          remotePlayerContainer.style.width = '100%'
          remotePlayerContainer.style.height = '168.76px'
          remotePlayerContainer.className = 'participants-video bg-gray-800 h-full rounded-lg text-black mb-3 overflow-hidden relative'
          const remotePlayerUsername = document.createElement('div')
          remotePlayerUsername.className = 'absolute top-0 left-0 pl-4 pb-2 z-20 w-full h-full flex justify-start items-end text-gray-300'
          const idx = this.eventDetail.participants.findIndex(p => p.userId === user.uid)
          remotePlayerUsername.innerText = this.eventDetail.participants[idx].User.username
          remotePlayerContainer.append(remotePlayerUsername)
          videoContainer.append(remotePlayerContainer)
          remoteVideoTrack.play(remotePlayerContainer)
        }
      }

      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack
        remoteAudioTrack.play()
      }

      this.rtc.client.on('user-unpublished', user => {
        const remotePlayerContainer = document.getElementById(user.uid)

        if (user.uid === this.screenId) {
          this.screenId = null

          if (this.hostVideoTrack) {
            const mainContainer = document.getElementById('main_video')

            mainContainer.style.width = '100%'
            const playerWidth = mainContainer.offsetWidth
            mainContainer.style.height = `${playerWidth / 16 * 9}px`

            this.hostVideoTrack.play(mainContainer)

            const hostContainer = document.getElementById('host_video')
            hostContainer.classList.add('hidden')
          }
        }

        if (user.uid === this.hostId) {
          const hostContainer = document.getElementById('host_video')

          hostContainer.classList.add('hidden')
        }
        remotePlayerContainer.remove()
      })

      this.rtc.client.on('user-left', () => {
        const userRemotes = this.rtc.client.remoteUsers
        const partChatDiv = document.getElementById('part_container')

        if (userRemotes.length === 0) {
          partChatDiv.classList.add('hidden')
        }
      })
    })
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
