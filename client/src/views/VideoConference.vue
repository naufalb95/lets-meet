<template>
  <div id='app' class='min-h-screen w-screen bg-gray-900 relative'>
    <div id='content' class='text-white pl-5 flex items-center'>
      <div id='video_container' class='flex-grow h-full p-2'>
        <div class='bg-gray-800 bg-opacity-80 w-full h-full rounded-lg text-black flex items-center justify-center relative overflow-hidden'>
          <div id='main_video' class='w-full relative z-10 h-full'></div>
          <div class="absolute top-0 left-0 h-full w-full flex justify-center items-center text-gray-300">Waiting for host to share their screen or cam</div>
        </div>
      </div>
      <div id='part_container' class='flex-grow-0 h-full p-2 overflow-y-scroll overflow-x-hidden'>
        <div id='video_part' class='flex-grow-0 relative' v-for="user of inMeetParticipants" :key="user.id">
          <div :id="user.id" class='participants-video bg-gray-800 h-full rounded-lg text-black mb-3 overflow-hidden relative'>
            <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center text-gray-300">{{ user.username }}</div>
            <div class="absolute top-0 right-0 z-10 w-full h-full flex justify-end items-start hidden text-gray-300 pr-2 pt-3" v-if="user.audioTrack">
              <font-awesome-icon :icon="['fas', 'microphone-alt-slash']" class="mr-2 text-red-500"/>
            </div>
            <div class="absolute top-0 left-0 z-20 w-full h-full flex justify-start items-end text-gray-300">
              <div class="px-4 bg-black bg-opacity-50 w-full overflow-hidden truncate">
                <span class="text-sm">{{ user.username }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div id='part_chat' class='h-full p-2'>
        <div class='bg-white h-full rounded-lg text-black'>
          <div class='p-3 h-full'>
            <div class="h-full relative">
              <div class="border-b border-gray-400 pb-2 font-semibold text-gray-700">
                Chat Participants
              </div>
              <div id="chat_container" class="overflow-y-auto overflow-x-hidden">
                <div v-for="(data, index) in chat.messages" :key="index" class="my-2">
                  <div><span class="font-semibold text-sm">{{ data.name }}</span> <span class="italic text-xs text-gray-400">{{ data.time }}</span></div>
                  <div class="text-sm">{{ data.message }}</div>
                </div>
              </div>
              <form style="height: 80px" class="flex absolute bottom-0 w-full" @submit.prevent="createNewMessage">
                <div class='w-5/6'>
                  <textarea type="text" @keydown="createNewMessage" id='chat_message' placeholder='Start talking with everyone!' class='p-1 border border-r-0 border-gray-300 w-full h-full rounded-l-md outline-none overflow-y-scroll overflow-x-hidden' v-model="chat.message" rows="2">
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
    </div>
    <div id='bottom_row' class='text-white pl-5 flex items-center justify-center'>
      <button ref="shareScreen" class='mx-2 px-5 py-2 bg-gray-600 rounded-full' @click="shareScreenHandler" v-if="isHostPresent"><font-awesome-icon :icon="['fas', 'desktop']" class="text-xl text-gray-300"/></button>
      <!-- <button class='mx-3' @click="shareScreenHandler" v-if="isHostPresent && isScreenSharing">Stop Screen Share</button> -->
      <button ref="camera" class='mx-2 px-5 py-2 bg-gray-600 rounded-full' @click="openCamHandler"><font-awesome-icon :icon="['fas', 'camera']" class="text-2xl text-gray-300"/></button>
      <!-- <button class='mx-3' @click="openCamHandler" v-if="isOpenCam">Close Cam</button> -->
      <!-- <button class='mx-3' @click="unmuteHandler" v-if="!isMuted">Mute</button> -->
      <button ref="mic" class='mx-2 px-5 py-2 bg-gray-600 rounded-full' @click="unmuteHandler"><font-awesome-icon :icon="['fas', 'microphone-alt']" class="text-2xl text-gray-300"/></button>
      <button class='mx-2 px-5 py-2 bg-red-600 rounded-full' @click="leaveHandler"><font-awesome-icon :icon="['fas', 'phone']" class="text-2xl text-gray-300"/></button>
    </div>
    <div class='absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-80 flex justify-center items-center z-40' v-if='!isJoined'>
      <div class='bg-white rounded w-3/12 py-12 px-8 flex justify-center items-center flex-col'>
        <h1 class='text-2xl text-center'>Already well dressed? Let's join by clicking the button!</h1>
        <div>
          <button class='bg-blue-800 text-white px-6 py-2 rounded-md mt-6 mr-3 btn hover:bg-blue-900' @click="joinHandler">Join</button>
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
        messages: [],
        message: ''
      },
      video: {
        client: null,
        screen: null
      },
      local: {
        video: null,
        audio: null,
        screen: null
      },
      hostId: null,
      isHostPresent: false,
      host: {},
      screenId: null,
      inMeetParticipants: [],
      participantVolumeId: null,
      screenShareTrack: null,
      isJoined: false,
      isMuted: true,
      isOpenCam: false,
      isScreenSharing: false
    }
  },
  computed: {
    ...mapState(['eventDetail', 'token'])
  },
  methods: {
    ...mapActions(['getChatToken', 'getVideoToken', 'getScreenToken', 'fetchEventDetail']),
    ...mapMutations({
      setIsVideoConference: 'SET_IS_VIDEO_CONFERENCE'
    }),
    async createNewMessage (e) {
      const checkEmptyMsg = this.chat.message.trim()
      if (this.chat.channel != null && (e.type === 'submit' || (e.type === 'keydown' && e.keyCode === 13)) && checkEmptyMsg) {
        await this.chat.channel.sendMessage({ text: this.chat.message })

        this.chat.messages.push({
          message: this.chat.message,
          name: 'You',
          time: format(utcToZonedTime(new Date(), 'Asia/Jakarta'), 'kk:mm')
        })

        this.chat.message = ''
      }
    },
    async leaveHandler () {
      if (this.local.video) this.local.video.close()
      if (this.local.audio) this.local.audio.close()
      if (this.local.screen) this.local.screen.close()

      await this.video.client.leave()

      this.setIsVideoConference(false)

      this.$router.push({ name: 'Home' })
    },
    async joinHandler () {
      await this.chat.channel.join()
      await this.video.client.join(this.options.appId, this.settings.channelName, this.token.video, this.settings.uid)

      this.isJoined = true
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

      // ! Chat Event Handler
      // * If there is a new message handler
      this.chat.channel.on('ChannelMessage', (message, uid) => {
        let username = ''

        const foundParticipant = this.inMeetParticipants.find(p => p.id === +uid)

        if (foundParticipant) username = foundParticipant.username
        else if (+uid === this.hostId) {
          const foundHost = this.inMeetParticipants.find(h => this.hostId === h.id)

          username = foundHost.username
        }

        this.chat.messages.push({
          message: message.text,
          name: username,
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

      // ! Video Call Event Handler
      this.video.client.on('user-joined', (user) => {
        const checkParticipant = this.inMeetParticipants.some(el => el.id === user.uid)
        const checkHost = this.eventDetail.event.eventOrganizerId === user.uid

        const checkScreenShareId = this.eventDetail.participants.some(el => el.userId === user.uid)

        if (!checkParticipant || checkHost) {
          if (!checkScreenShareId && !checkHost) this.screenId = user.uid

          const remoteUser = {
            id: user.uid
          }

          const userDetail = this.eventDetail.participants.find(el => el.userId === remoteUser.id)

          if (userDetail) remoteUser.username = userDetail.User.username
          else {
            if (remoteUser.id === this.hostId) remoteUser.username = this.eventDetail.eventOrganizer.username + ' (Host)'
          }

          if (this.screenId !== remoteUser.id || checkHost) {
            this.inMeetParticipants.push(remoteUser)
          }
        }
      })

      // ! When a user activating video or audio
      this.video.client.on('user-published', async (user, mediaType) => {
        await this.video.client.subscribe(user, mediaType)

        if (mediaType === 'video') {
          const hostDetail = this.inMeetParticipants.find(el => el.id === this.hostId)

          if (hostDetail) {
            // ! Jika hostnya ada

            if (this.screenId === user.uid) {
              // ! Jika ini screen
              // ! dan ada host
              // ! Maka screen masuk ke main_video
              // ! cam host pindah ke kanan

              this.screenShareTrack = user.videoTrack

              this.screenShareTrack.play('main_video', {
                fit: 'contain'
              })

              hostDetail.screenTrack.play(hostDetail.id.toString(), {
                fit: 'contain'
              })
            } else if (hostDetail.id === user.uid && !this.screenId) {
              // ! Jika ini adalah host
              // ! Jika tidak ada screen share
              // ! Maka screen masuk ke main_video

              hostDetail.screenTrack = user.videoTrack

              hostDetail.screenTrack.play('main_video', {
                fit: 'contain'
              })
            } else if (hostDetail.id === user.uid && this.screenId) {
              // ! Jika ini adalah host
              // ! Jika ada screenshare
              // ! Maka masuk ke div kecil
              hostDetail.screenTrack = user.videoTrack

              hostDetail.screenTrack.play(hostDetail.id.toString(), {
                fit: 'contain'
              })
            } else {
              // ! Jika ini adalah user
              // ! Dan ada host
              // ! Maka masuk ke div kecil

              user.videoTrack.play(user.uid.toString(), {
                fit: 'contain'
              })
            }
          } else {
            if (this.screenId === user.uid) {
              // ! Jika tidak ada cam host
              // ! Jika ini adalah screen
              // ! Maka masuk layar besar

              this.screenShareTrack = user.videoTrack

              this.screenShareTrack.play('main_video')
            } else {
              // ! Jika tidak ada host
              // ! Jika user
              user.videoTrack.play(user.uid.toString(), {
                fit: 'contain'
              })
            }
          }

          // else {
          //   user.videoTrack.play(user.uid.toString(), {
          //     fit: 'contain'
          //   })
          // }

          // ! .... ini udah work
          // if (this.hostId === user.uid || this.screenId === user.uid) {
          //   const videoTrack = user.videoTrack
          //   videoTrack.play('main_video', {
          //     fit: 'contain'
          //   })

          //   const hostDetail = this.inMeetParticipants.find(el => el.id === this.hostId)

          //   if (hostDetail) {
          //     if (hostDetail.screenTrack) {
          //       hostDetail.screenTrack.play(hostDetail.id.toString(), {
          //         fit: 'contain'
          //       })
          //     }
          //   }
          // } else {
          //   user.videoTrack.play(user.uid.toString(), {
          //     fit: 'contain'
          //   })
          // }
          // @ .... ini udah work
        }

        if (mediaType === 'audio') {
          const userDetail = this.inMeetParticipants.find(p => p.id === user.uid)
          userDetail.audioTrack = user.audioTrack

          userDetail.audioTrack.play()
        }
      })

      this.video.client.on('user-unpublished', (user, mediaType) => {
        const hostDetail = this.inMeetParticipants.find(el => el.id === this.hostId)

        if (hostDetail) {
          if (this.screenId === user.uid) {
            // ! Yang keluar adalah screen share
            // ! Ada open cam host

            this.screenId = null
            hostDetail.screenTrack.play('main_video', {
              fit: 'contain'
            })
          }
        }

        console.log(user, mediaType)

        if (mediaType === 'audio') {
          const userDetailIndex = this.inMeetParticipants.findIndex(p => p.id === user.uid)
          this.inMeetParticipants[userDetailIndex].audioTrack = null
        }

        // if (user.uid === this.screenId) {
        //   // ! Clear screen share ID if it is unpublished
        //   this.screenId = null
        // }
      })

      // ! When a user left video call
      this.video.client.on('user-left', async (user) => {
        if (user.uid === this.screenId) {
          this.screenId = null
        } else {
          this.inMeetParticipants = this.inMeetParticipants.filter(participant => participant.id !== user.uid)
        }
      })
    },
    async openCamHandler () {
      if (!this.isOpenCam) {
        this.inMeetParticipants[0].videoTrack = await AgoraRTC.createCameraVideoTrack()

        await this.video.client.publish(this.inMeetParticipants[0].videoTrack)

        this.inMeetParticipants[0].videoTrack.play(this.inMeetParticipants[0].id.toString(), {
          fit: 'contain'
        })

        this.isOpenCam = true

        this.$refs.camera.classList.add('bg-red-600')
        this.$refs.camera.classList.remove('bg-gray-600')
      } else {
        await this.video.client.unpublish(this.inMeetParticipants[0].videoTrack)

        this.inMeetParticipants[0].videoTrack.close(true)

        this.isOpenCam = false

        this.$refs.camera.classList.remove('bg-red-600')
        this.$refs.camera.classList.add('bg-gray-600')
      }
    },
    async closeCamHandler () {
      this.inMeetParticipants[0].videoTrack.setEnabled(false)
    },
    async unmuteHandler () {
      if (this.isMuted) {
        this.inMeetParticipants[0].audioTrack = await AgoraRTC.createMicrophoneAudioTrack()

        await this.video.client.publish(this.inMeetParticipants[0].audioTrack)

        this.isMuted = false

        this.$refs.mic.classList.add('bg-red-600')
        this.$refs.mic.classList.remove('bg-gray-600')
      } else {
        await this.video.client.unpublish(this.inMeetParticipants[0].audioTrack)

        this.inMeetParticipants[0].audioTrack = null

        this.isMuted = true

        this.$refs.mic.classList.remove('bg-red-600')
        this.$refs.mic.classList.add('bg-gray-600')
      }
    },
    async muteHandler () {
      await this.video.client.unpublish(this.inMeetParticipants[0].audioTrack)

      this.local.video.close(true)

      this.isMuted = true
    },
    async shareScreenHandler () {
      if (!this.isScreenSharing) {
        await this.getScreenToken({ channelName: this.settings.channelName })

        this.video.screen = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

        await this.video.screen.join(this.options.appId, this.settings.channelName, this.token.screen)

        this.local.screen = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_1',
          optimizationMode: 'detail'
        })

        await this.video.screen.publish(this.local.screen)

        this.isScreenSharing = true

        this.$refs.shareScreen.classList.add('bg-red-600')
        this.$refs.shareScreen.classList.remove('bg-gray-600')
      } else {
        await this.video.screen.unpublish(this.local.screen)

        this.local.screen.close(true)

        await this.video.screen.leave()

        this.screenId = null

        this.$refs.shareScreen.classList.remove('bg-red-600')
        this.$refs.shareScreen.classList.add('bg-gray-600')
      }
    },
    async stopScreenShareHandler () {
      await this.video.screen.unpublish(this.local.screen)

      this.local.screen.close(true)

      await this.video.screen.leave()

      this.screenId = null
    }
  },
  async created () {
    this.setIsVideoConference(true)
    // ! Get Event Detail
    this.eventId = +this.$route.params.id
    await this.fetchEventDetail(this.eventId)

    this.hostId = this.eventDetail.event.eventOrganizerId

    // ! Set App ID, Channel Name, and uid
    this.options.appId = process.env.VUE_APP_AGORA_API_KEY
    this.settings.channelName = this.eventDetail.event.id.toString()
    this.settings.uid = +localStorage.getItem('user_id')
    this.isHostPresent = this.eventDetail.event.eventOrganizerId === this.settings.uid

    const userDetail = this.eventDetail.participants.find(el => el.userId === this.settings.uid)
    let username = ''

    if (userDetail) username = userDetail.User.username
    else {
      if (this.settings.uid === this.hostId) username = this.eventDetail.eventOrganizer.username + ' (Host)'
    }

    this.inMeetParticipants.push({
      id: this.settings.uid,
      username
    })

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

  #chat_container {
    max-height: calc(100% - 130px);
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  #chat_container::-webkit-scrollbar {
    display: none;
  }
</style>
