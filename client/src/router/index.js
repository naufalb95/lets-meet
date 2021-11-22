import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Event from '../views/Event.vue'
import Detail from '../views/Detail.vue'
import MyEvent from '../views/MyEvent.vue'
import VideoConference from '../views/VideoConference.vue'
import Create from '../views/Create.vue'
import Edit from '../views/Edit.vue'
import FourZeroFour from '../views/FourZeroFour.vue'

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
    path: '/event/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/event/:id/edit',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/event/:id/meet',
    name: 'VideoConference',
    component: VideoConference
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
    path: '/404',
    name: 'FourZeroFour',
    component: FourZeroFour
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const at = localStorage.getItem('access_token')
  if ((to.name === 'Create' && !at) || (to.name === 'Edit' && !at) || (to.name === 'VideoConference' && !at) || (to.name === 'MyEvent' && !at)) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
