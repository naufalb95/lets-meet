import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Event from '../views/Event.vue'
import Detail from '../views/Detail.vue'
import MyEvent from '../views/MyEvent.vue'
import VideoConference from '../views/VideoConference.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/event',
    name: 'Event',
    component: Event
  },
  {
    path: '/event/:id',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/myevent',
    name: 'MyEvent',
    component: MyEvent
  },
  {
    path: '/event/:id/meet',
    name: 'VideoConference',
    component: VideoConference
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
