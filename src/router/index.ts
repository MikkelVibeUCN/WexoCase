import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../Views/HomeView.vue'
import PopularView from '../Views/PopularView.vue'
import MovieView from '../Views/MovieView.vue'
import FavoritesView from '../Views/FavoritesView.vue'
import GenreView from '../Views/GenreView.vue'

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
  {
    path: '/genre/:id',
    name: 'genre',
    component: GenreView
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router