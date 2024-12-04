import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Tools from '../views/Tools.vue'
import About from '../views/About.vue'
import Vision from '../views/Vision.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tools',
      name: 'tools',
      component: Tools
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/vision',
      name: 'vision',
      component: Vision
    }
  ]
})

export default router
