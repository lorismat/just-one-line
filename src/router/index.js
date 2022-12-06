import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CanvasView from '../views/CanvasView.vue'
import ErrorView from '../views/ErrorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:id',
      name: 'pages',
      component: () => import('../views/CanvasView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    // not found
    { 
      path: '/0', 
      name: 'route-without-canvas', 
      component: ErrorView 
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'default', 
      component: ErrorView 
    },
  ]
})

router.replace(router.currentRoute.value.fullPath)

export default router
