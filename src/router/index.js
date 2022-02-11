import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../views/layout/index.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/',
    component: layout,
    children: [{
      path: '/home',
      component: '../views/home/index.vue'
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router