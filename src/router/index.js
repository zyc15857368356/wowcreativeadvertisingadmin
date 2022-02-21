import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../views/layout/index.vue'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: () => import('../views/login.vue')
},
{
  path: '/',
  component: layout,
  redirect: '/login',
  children: [
    {
      path: '/home',
      component: () => import('../views/home/index.vue'),
    },
    {
      path: '/account',
      component: () => import('../views/account/index.vue'),
    }
  ]
},
]

const router = new VueRouter({
  routes
})


export default router