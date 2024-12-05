import { createRouter, createWebHistory } from 'vue-router'
import pageRoutes from '~pages'
import Home from '../views/Home.vue'
import Tools from '../views/Tools.vue'
import About from '../views/About.vue'
import Vision from '../views/Vision.vue'

console.log('All routes:', pageRoutes)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/tools',
    name: 'tools',
    component: Tools,
    children: pageRoutes.filter(route => {
      console.log('Checking route:', route)
      return route.path.includes('tools/')
    }).map(route => ({
      ...route,
      path: route.path.replace('tools/', '')
    }))
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
