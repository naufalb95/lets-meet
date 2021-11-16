<template>
  <div id='app' class='min-h-screen w-screen bg-gray-900 relative'>
    <div id='back_row' class='text-white pl-5 flex items-center'>
      <button>Home</button>
    </div>
    <div id='content' class='text-white pl-5 flex items-center'>
      <div id='video_container' class='flex-grow h-full p-2'>
        <div class='bg-black bg-opacity-80 w-full h-full rounded-lg text-black flex items-center justify-center'>
          <div id='main_video' class='w-full'></div>
        </div>
      </div>
      <div id='part_container' class='flex-grow-0 h-full p-2 hidden'>
        <div id='video_part' class='flex-grow-0 h-full overflow-x-hidden overflow-y-scroll part_video_container'>
          <div id='host_video' class='participants-video bg-white h-full rounded-lg text-black mb-3 overflow-hidden hidden'></div>
          <div id='local_video' class='participants-video bg-white h-full rounded-lg text-black mb-3 overflow-hidden'></div>
        </div>
      </div>
       <div id='part_chat' class='flex-grow-0 h-full p-2'>
        <div class='bg-white h-full rounded-lg text-black'>
          <div class='p-3 overflow-auto' style="height: 87.5%">
            <div class="border-b-2 border-black mb-2">
              Chat Participants
            </div>
            <div v-for="(data, index) in this.getMessages" :key="index" class="my-2"> // ! dapetin semua message dari Computed
              <div><span class="font-semibold text-sm">{{ data.name }},</span> <span class="italic text-xs text-gray-400">{{ data.time }}</span></div>
              <div class="text-sm">{{ data.message }}</div>
            </div>
          </div>
          <div class="flex p-3" style="height: 12.5%" @submit.prevent="createNewMessage"> // ! bikin chat/message
            <div class='w-5/6'>
              <textarea id='chat_message' placeholder='Start talking with everyone!' class='p-1 border border-gray-300 w-full h-full rounded-l-md outline-none' v-model="newMessage"></textarea>
            </div>
            <div class='w-1/6'>
              <button class='p-1 border border-gray-300 w-full h-full rounded-r-md outline-none'><i class="fab fa-telegram-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id='bottom_row' class='text-white pl-5 flex items-center'>
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
import date from 'date-and-time'

// ! Tombol Screen Share hanya ada host saja

// ! options dan rtc dimasukkan ke state data

// ! Login jalan saat pertamakali masuk halaman

// ! KONDISI AWAL MIC MUTED

// ! event handler chat di created

// ! dapetin semua chat di computed

// ! ganti date and time ke date-fns

export default {
  name: 'VideoConference',
  data () {
    return {
      isJoined: true,
      isMuted: true,
      isOpenCam: false,
      isHost: false,
      myId: 1234562, // * Diisi dari localStorage
      hostId: 123456, //* Diisi dari database
      isHostPresent: false,
      screenId: null,
      isScreenShare: false,
      participantsId: [1, 12345672], //* Diisi dari database
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
        appId: 'bba821c9f0374c0a86b015c0668097d8',
        channel: 'test2',
        token: '006bba821c9f0374c0a86b015c0668097d8IADgTMOAOH7BSLZqBu12dAL35jIyzLd6k2S0wvPHmJK+9FiNuxMAAAAAEABr21wCKaWSYQEAAQAMpZJh',
        uid: 123456
      },
      newMessage: null, // * buat bikin message
      name: null, // * buat bikin message
      token: null // * buat token
    }
  },
  methods: {
    // ! buat pesan / chat baru
    async createNewMessage () {
      const channel = this.$store.state.tokenMessage
      if (channel != null) {
        await channel.sendMessage({ text: this.newMessage }).then(() => {
          this.$store.commit('GET_ALL_MESSAGES', { message: this.newMessage, name: this.name, time: date.format(new Date(), 'hh:mm A') }) // ! <---- this.name == nama user yg masuk
          this.newMessage = null
        })
          .catch((err) => { console.log('kirim message ke channel mana lu woi?', err) }) // ! boleh di custom lagi catch nya wkwk
      }
    },
    // ! login buat fitur chat/message
    login () {
      this.$store.dispatch('getTokenMessage', { name: this.name, channelName: this.options.channel }) // ! this.name == nama user yg masuk, masukin nama channel di channelName
        .then(async (data) => {
          this.token = data.token
          const appID = 'ffe414caa68c4da0a6b8837b05bc649e'
          const client = AgoraRTM.createInstance(appID)
          const options = {
            uid: this.name, // ! nama user
            token: this.token // ! token dari server
          }
          if (this.name) {
            await client.login(options)
            const channel = client.createChannel(this.options.channel) // ! <----------dinamis nama channel
            await channel.join()
            this.$store.commit('GET_TOKEN_MESSAGE', channel)
          } else {
            this.errorText = 'Please enter your name.'
          }
        })
        .catch((err) => {
          console.log('masuk sini')
          console.log(err)
        })
    },
    async joinHandler () {
      await this.rtc.client.join(this.options.appId, this.options.channel, this.options.token, +this.options.uid)
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
      this.rtc.localAudioTrack.close()
      this.rtc.localVideoTrack.close()

      this.rtc.client.remoteUsers.forEach(() => {
        const playerContainer = document.getElementById('video_container')
        playerContainer && playerContainer.remove()
      })

      await this.rtc.client.leave()
    },
    async openCamHandler () {
      if (!this.rtc.localVideoTrack) {
        this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
        await this.rtc.client.publish(this.rtc.localVideoTrack)

        let container = null

        // ! Check localStorage pada userId, kalau dia host maka masuk sini, ganti this.options.uid-nya
        if (this.hostId === +this.options.uid && !this.screenId) {
          container = document.getElementById('main_video')
          const localVidDiv = document.getElementById('local_video')
          localVidDiv.className = ''

          container.style.height = `${container.offsetWidth / 16 * 9}px`
        } else {
          // * Jika bukan host, cam local masuk ke sini
          container = document.getElementById('local_video')
          const partChatDiv = document.getElementById('part_container')
          partChatDiv.classList.remove('hidden')

          container.className = 'participants-video bg-white h-full rounded-lg text-black mb-3 overflow-hidden'
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

      if (this.hostId === +this.options.uid) {
        // ! Jika user adalah host, maka localVidDiv ditutup dan partchat div ditutup
        if (this.isScreenShare && remoteUsers.length === 1) {
          partChatDiv.classList.add('hidden')
        }
      }

      this.rtc.localVideoTrack = null
      this.isOpenCam = false
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
      let container = null

      this.rtc.screenClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      await this.rtc.screenClient.join(this.options.appId, this.options.channel, this.options.token)

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

        container.className = 'participants-video bg-white h-full rounded-lg text-black mb-3 overflow-hidden'

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

        this.rtc.localVideoTrack.play(container)
      }
    }
  },
  async created () {
    this.$store.commit('SET_IS_VIDEO_CONFERENCE', true)
    // ! event handler chat
    const channel = this.$store.state.tokenMessage
    channel.on('ChannelMessage', (message, memberId) => {
      const obj = {
        message: message.text,
        name: memberId,
        time: date.format(new Date(), 'hh:mm A')
      }
      this.$store.commit('GET_ALL_MESSAGES', obj)
    })
  },
  computed: {
    // ! dapetin semua pesan
    getMessages () {
      return this.$store.state.messages
    }
  },
  async mounted () {
    window.addEventListener('resize', this.videoResizeHandler)

    this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

    // ! Cek apakah user adalah host
    if (this.hostId === +this.options.uid) this.isHost = true

    // ! Check localStorage pada userId, kalau dia host maka masuk sini, ganti this.options.uid-nya
    if (this.hostId === +this.options.uid) {
      // * Jika user adalah host
      const localVidDiv = document.getElementById('local_video')

      localVidDiv.className = ''
    } else {
      // * Jika user adalah participant
      const partChatDiv = document.getElementById('part_container')

      partChatDiv.classList.remove('hidden')
    }

    this.rtc.client.on('user-published', async (user, mediaType) => {
      await this.rtc.client.subscribe(user, mediaType)

      const userRemotes = this.rtc.client.remoteUsers

      const partChatDiv = document.getElementById('part_container')

      const isParticipant = this.participantsId.includes(user.uid)

      if (!isParticipant && user.uid !== this.hostId) this.screenId = user.uid

      if ((userRemotes.length !== 0 && userRemotes[0].uid !== this.screenId) || (this.screenId && this.rtc.localVideoTrack)) {
        partChatDiv.classList.remove('hidden')
      }

      if (userRemotes.length === 0) {
        partChatDiv.classList.add('hidden')
      }

      let videoContainer = null

      videoContainer = document.getElementById('video_part')

      if (user.uid === this.hostId) this.isHostPresent = true

      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack

        if (user.uid === this.screenId && this.options.uid !== this.hostId) {
          // * Jika client adalah screen share
          const mainContainer = document.getElementById('main_video')

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

        if (user.uid === this.hostId) {
          // * Jika client adalah host
          if (this.screenId) {
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
          // * Jika client bukanlah screen dan host
          const remotePlayerContainer = document.createElement('div')
          remotePlayerContainer.id = user.uid.toString()
          remotePlayerContainer.style.width = '100%'
          remotePlayerContainer.style.height = '168.76px'
          remotePlayerContainer.className = 'bg-white h-full rounded-lg text-black mb-3 overflow-hidden'
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
  #back_row {
    height: 50px;
  }

  #content {
    height: calc(100vh - 110px);
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

  #chat_message{
    resize: none;
  }

  .btn {
    width: 100px;
  }
</style>
