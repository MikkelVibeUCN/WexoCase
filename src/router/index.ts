import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PopularView from '../views/PopularView.vue'
import MovieView from '../Views/MovieView.vue'
import FavoritesView from '../Views/FavoritesView.vue'

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

  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesView

  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
