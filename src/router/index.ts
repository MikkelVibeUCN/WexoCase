import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PopularView from '../views/PopularView.vue'
import MovieView from '../Views/MovieView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/popular',
    name: 'Popular',
    component: PopularView
  },
  {
    path: '/movie/:id',
    name: 'Movie',
    component: MovieView

  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
