<template>
    <div class="favorites-container">
      <h1 class="favorites-title">Your Favorite Movies</h1>
      <div class="favorites-grid">
        <Movie
          v-for="movie in favoriteMovies"
          :key="movie.id"
          :id="movie.id"
          :title="movie.title"
          :imageUrl="movie.trailerImageUrl"
          :genres="movie.genres"
          :rating="movie.rating"
          width="160px"
        />
      </div>
      <div v-if="!favoriteMovies.length && loaded" class="empty-message">
        You haven’t added any favorites yet.
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Movie from '../components/Shared/Movie.vue'
  import { MovieService } from '../Services/MovieService'
  import type { MovieShort } from '../Services/MovieService'
  
  const favoriteMovies = ref<MovieShort[]>([])
  const loaded = ref(false)
  
  onMounted(async () => {
    try {
      favoriteMovies.value = await MovieService.getFavoriteMovies()
    } catch (err) {
      console.error('Error loading favorites:', err)
    } finally {
      loaded.value = true
    }
  })
  </script>
  
  <style scoped>
  .favorites-container {
    padding: 2rem;
    color: white;
  }
  
  .favorites-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }
  
  .empty-message {
    margin-top: 2rem;
    text-align: center;
    font-size: 1rem;
    opacity: 0.7;
  }
  </style>
  