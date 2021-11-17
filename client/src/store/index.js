import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const server = axios.create({
  baseURL: 'http://localhost:3000'
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isModalLogin: false,
    isModalRegister: false,
    isModalCreate: false,
    isModalEdit: false,
    isLogin: false,
    isVideoConference: false,
    userId: null,
    events: [],
    eventDetail: {
      event: {
        categoryId: 0,
        dateAndTime: '',
        description: '',
        eventOrganizerId: 0,
        id: 0,
        imgUrl: '',
        location: '',
        maxParticipants: 0,
        name: '',
        tokenVideo: ''
      },
      eventOrganizer: {
        email: '',
        id: 0,
        username: ''
      },
      participants: []
    },
    token: {
      chat: '',
      video: '',
      screen
    },
    messages: []
  },
  mutations: {
    GET_TOKEN_MESSAGE (state, payload) {
      state.tokenMessage = payload
    },
    GET_TOKEN_VIDEO (state, payload) {
      state.tokenVideo = payload
    },
    GET_ALL_MESSAGES (state, payload) {
      state.messages.push(payload)
    },
    SET_IS_MODAL_SHOW_LOGIN (state, payload) {
      state.isModalLogin = payload
    },
    SET_IS_MODAL_SHOW_REGISTER (state, payload) {
      state.isModalRegister = payload
    },
    SET_IS_MODAL_SHOW_CREATE (state, payload) {
      state.isModalCreate = payload
    },
    SET_IS_MODAL_SHOW_EDIT (state, payload) {
      state.isModalEdit = payload
    },
    SET_IS_LOGIN (state, payload) {
      state.isLogin = payload
    },
    SET_IS_VIDEO_CONFERENCE (state, payload) {
      state.isVideoConference = payload
    },
    SET_USER_ID (state, payload) {
      state.userId = payload
    },
    SET_EVENTS (state, payload) {
      state.events = payload
    },
    SET_EVENT_DETAIL (state, payload) {
      state.eventDetail = payload
    },
    SET_CATEGORIES (state, payload) {
      state.categories = payload
    },
    SET_TOKEN_VIDEO (state, payload) {
      state.token.video = payload
    },
    SET_TOKEN_SCREEN (state, payload) {
      state.token.screen = payload
    },
    SET_TOKEN_CHAT (state, payload) {
      state.token.chat = payload
    }
  },
  actions: {
    async getChatToken (context, payload) {
      try {
        const response = await server({
          url: `/create_chat_token?channelName=${payload.channelName}&uid=${payload.uid}`,
          method: 'GET'
        })
        context.commit('SET_TOKEN_CHAT', response.data.token)
      } catch (error) {
        console.log(error)
      }
    },
    async getVideoToken (context, payload) {
      try {
        const response = await server({
          url: `/create_video_token?channelName=${payload.channelName}&uid=${payload.uid}`,
          method: 'GET'
        })
        context.commit('SET_TOKEN_VIDEO', response.data.token)
      } catch (error) {
        console.log(error)
      }
    },
    async getScreenToken (context, payload) {
      try {
        const response = await server({
          url: `/create_video_token?channelName=${payload.channelName}`,
          method: 'GET'
        })
        context.commit('SET_TOKEN_SCREEN', response.data.token)
      } catch (error) {
        console.log(error)
      }
    },
    async fetchEvents (context, payload) {
      try {
        const response = await server({
          method: 'GET',
          url: '/events',
          params: payload
        })
        context.commit('SET_EVENTS', response.data)
      } catch (error) {
        console.log(error)
      }
    },
    async fetchEventDetail (context, payload) {
      try {
        const response = await server({
          method: 'GET',
          url: '/events/' + payload
        })
        context.commit('SET_EVENT_DETAIL', response.data)
      } catch (error) {
        console.log(error)
      }
    },
    async fetchMyEvents (context) {
      try {
        const response = await server({
          method: 'GET',
          url: '/myevent',
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })
        context.commit('SET_EVENTS', response.data)
      } catch (error) {
        console.log(error)
      }
    },
    async attendEvent (_, payload) {
      try {
        await server({
          method: 'POST',
          url: '/events/' + payload,
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async registerUser (_, payload) {
      try {
        await server({
          method: 'POST',
          url: '/users/register',
          data: payload
        })
      } catch (error) {
        console.log(error)
      }
    },
    async loginUser (context, payload) {
      try {
        const response = await server({
          method: 'POST',
          url: '/users/login',
          data: payload
        })
        const token = response.data.access_token
        const userId = response.data.id
        localStorage.setItem('access_token', token)
        localStorage.setItem('user_id', userId)
        context.commit('SET_IS_LOGIN', true)
        context.commit('SET_USER_ID', userId)
      } catch (error) {
        console.log(error)
      }
    },
    async createEvent (_, payload) {
      try {
        console.log(payload)
        const formData = new FormData()
        for (const key in payload) {
          formData.append(key, payload[key])
        }
        await server({
          method: 'POST',
          url: '/events',
          headers: {
            access_token: localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        })
      } catch (error) {
        console.log(error)
      }
    },
    async editEvent (_, payload) {
      console.log(payload)
      const formData = new FormData()
      for (const key in payload.form) {
        formData.append(key, payload.form[key])
      }
      try {
        await server({
          method: 'PUT',
          url: '/events/' + payload.eventId,
          headers: {
            access_token: localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        })
      } catch (error) {
        console.log(error)
      }
    },
    async userLeaveEvent (_, payload) {
      try {
        await server({
          method: 'DELETE',
          url: '/events/' + payload + '/participants',
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async deleteEvent (_, payload) {
      try {
        await server({
          method: 'DELETE',
          url: '/events/' + payload,
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async doneEvent (_, payload) {
      try {
        await server({
          method: 'PATCH',
          url: '/events/' + payload,
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async fetchCategories (context) {
      try {
        const response = await server({
          method: 'GET',
          url: '/categories'
        })
        context.commit('SET_CATEGORIES', response.data)
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
  }
})
