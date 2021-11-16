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
      participants: [],
      tokenMessage: '',
      messages: []
    }
  },
  mutations: {
    GET_TOKEN_MESSAGE (state, payload) {
      state.tokenMessage = payload
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
    SET_EVENTS (state, payload) {
      state.events = payload
    },
    SET_EVENT_DETAIL (state, payload) {
      state.eventDetail = payload
    }
  },
  actions: {
    getTokenMessage (context, payload) {
      return new Promise((resolve, reject) => {
        axios({
          url: `/access_token?channelName=${payload.channelName}&uid=${payload.uid}`,
          method: 'GET'
        })
          .then(({ data }) => {
            resolve(data)
          })
          .catch((err) => {
            console.log('fail')
            reject(err)
          })
      })
    },
    async findGooglePlaces () {
      const config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=mongolian&inputtype=textquery&locationbias=circle%3A2000%4047.6918452%2C-122.2226413&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyDOJpP-lEnakyV5PKJHbSOzKxTUu9oIeh0',
        headers: {},
        secure: false
      }

      axios(config)
        .then(() => {
          console.log('hai masuk')
        })
        .catch(err => {
          console.log(err)
        })

      // console.log(response)
    },
    async fetchEvents (context, payload) {
      const response = await server({
        method: 'GET',
        url: '/events',
        params: payload
      })

      context.commit('SET_EVENTS', response.data)
    },
    async fetchEventDetail (context, payload) {
      const response = await server({
        method: 'GET',
        url: '/events/' + payload
      })

      context.commit('SET_EVENT_DETAIL', response.data)
    },
    async attendEvent (_, payload) {
      const response = await server({
        method: 'POST',
        url: '/events/' + payload.eventId,
        headers: {
          access_token: 'token'
        }
      })

      console.log(response.data)
    },
    async registerUser (_, payload) {
      await server({
        method: 'POST',
        url: '/users/register',
        data: payload
      })
    },
    async loginUser (_, payload) {
      const response = await server({
        method: 'POST',
        url: '/users/login',
        data: payload
      })

      const token = response.data.access_token

      localStorage.setItem('access_token', token)
    },
    async createEvent (_, payload) {
      await server({
        method: 'POST',
        url: '/events',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: payload
      })
    }
  },
  modules: {
  }
})
