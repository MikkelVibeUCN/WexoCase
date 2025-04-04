<template>
  <div class="favorites-container">
    <h1 class="favorites-title">Your Favorite Movies</h1>

    <transition-group name="fade" tag="div" class="favorites-grid">
      <Movie
        v-for="movie in favoriteMovies"
        :key="movie.id"
        :id="movie.id"
        :title="movie.title"
        :imageUrl="movie.trailerImageUrl"
        :genres="movie.genres"
        :rating="movie.rating"
        width="160px"
        @favorite-toggled="handleFavoriteChange"
      />
    </transition-group>

    <div v-if="!favoriteMovies.length && loaded" class="empty-message">
      You haven’t added any favorites yet.
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import Movie from '../components/Shared/movie.vue'
import { MovieService, type MovieShort, favoriteState } from '../Services/MovieService'
import { AccountService } from '../Services/AccountService'

const favoriteMovies = ref<MovieShort[]>([])
const loaded = ref(false)

async function loadFavorites() {
  try {
    loaded.value = false

    await AccountService.initializeSession()
    await MovieService.loadFavoriteMoviesIfNeeded()

    favoriteMovies.value = await MovieService.getFavoriteMovies()
  } 
  catch (err) {
    console.error('Error loading favorites:', err)
  } 
  finally {
    loaded.value = true
  }
}

function handleFavoriteChange({ id, isFavorited }: { id: number; isFavorited: boolean }) {
  if (!isFavorited) {
    favoriteMovies.value = favoriteMovies.value.filter(m => m.id !== id)
  }
}
onMounted(loadFavorites)

watchEffect(async () => {
  const version = favoriteState.version
  const newFavorites = await MovieService.getFavoriteMovies()

  // Avoid breaking the array reference → use .splice()
  favoriteMovies.value.splice(0, favoriteMovies.value.length, ...newFavorites)
})

</script>

<style scoped>

.favorites-container {
  padding: 2rem;
  padding-top: 5rem;
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

/* Fade transition for movie card removal */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>