import { createRouter, createWebHistory } from 'vue-router'
import RootView from '../views/RootView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'root',
      component: RootView
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/habit',
      name: 'habit',
      component: () => import('../views/HabitView.vue')
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../views/EditView.vue')
    },
    {
      path: '/visualize',
      name: 'visualize',
      component: () => import('../views/VisualizeView.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/ShopView.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue')
    }
  ]
})

export default router
