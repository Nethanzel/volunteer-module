import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/registrarse',
    name: 'Registrarse',
    component: () => import('../components/RegisterForm.vue')
  },
  {
    path: '/resultado',
    name: 'Resultado',
    component: () => import('../views/ActionResult.vue')
  },
  {
    path: '/voluntarios',
    name: 'Voluntarios',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
