<template>
  <div v-if="loaded" class="movie-container">
    <img class="movie-backdrop" :src="movie!.backDropImageUrl" alt="Backdrop" />

    <div class="movie-content">
      <div class="movie-box">
        <button class="favorite-btn">❤️</button>

        <img class="trailer-image" :src="movie!.trailerImageUrl" alt="Trailer" @click="handleTrailerClick" />

        <div class="movie-details">
          <div class="title-row">
            <div class="title-meta">
              <h1 class="movie-title">{{ movie!.title }}</h1>
              <p class="movie-meta">
                {{ movie!.releaseYear }} | {{ formattedRuntime }} | {{ movie!.age }}
              </p>
              <div class="genre-tags">
                <span class="genre-tag" v-for="(genre, i) in movie!.genres" :key="i">
                  {{ genre }}
                </span>
              </div>
            </div>

            <img class="trailer-image-mobile" :src="movie!.trailerImageUrl" alt="Trailer" @click="handleTrailerClick" />
          </div>

          <p class="movie-description">
            {{ movie!.description || 'No description available.' }}
          </p>

          <p class="movie-info">
            <span class="label">Starring</span>: {{ movie!.top3Crew }}
          </p>
          <p class="movie-info">
            <span class="label">Created by</span>: {{ movie!.directorName }}
          </p>

          <div class="trailer-embed" v-show="movie?.trailerUrl !== ''">
            <iframe :src="movie!.trailerUrl" title="Movie Trailer" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup for small screens -->
    <div v-if="showTrailerPopup" class="popup-overlay">
      <div class="popup-image-wrapper">
        <button class="close-btn" @click="showTrailerPopup = false">Close</button>
        <img class="popup-trailer-image" :src="movie!.trailerImageUrl" alt="Trailer Large View" />
      </div>
    </div>


  </div>

  <div v-else class="loading-message">Loading movie details...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { MovieService, type MovieDetailed } from '../Services/MovieService'
import { AccountService } from '../Services/AccountService'

const route = useRoute()
const movieId = Number(route.params.id)

const movie = ref<MovieDetailed | null>(null)
const loaded = ref(false)

const showTrailerPopup = ref(false)

function handleTrailerClick() {
  if (window.innerWidth < 768) {
    showTrailerPopup.value = true
  }
}

const formattedRuntime = computed(() => {
  if (!movie.value) return ''
  const hours = Math.floor(movie.value.runtime / 60)
  const minutes = movie.value.runtime % 60
  return `${hours}h ${minutes}min`
})

// Get data by caching or finding
onMounted(async () => {
  if (movieId) {
    const cached = MovieService.getCachedMovie(movieId)
    if (cached) {
      movie.value = cached
      loaded.value = true
      return
    }

    try {
      const result = await MovieService.getAllMovieDetails(movieId)
      movie.value = result
      loaded.value = true
    } catch (err) {
      console.error('Failed to load movie details', err)
    }
  }
})
</script>

<style scoped>
/* === Layout Base === */
.movie-container {
  position: relative;
  width: 100%;
  height: 100vh;
  color: white;
  z-index: 0;
}

.movie-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) blur(4px);
}

.movie-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  height: 100%;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .movie-content {
    flex-direction: row;
  }
}

/* === Popup Image === */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.popup-image-wrapper {
  position: relative;
  max-width: 90%;
  max-height: 80vh;
}

.popup-trailer-image {
  width: 100%;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  display: block;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  border: none;
  border-radius: 9999px;
  width: 8rem;
  height: 4rem;
  text-align: center;
  vertical-align: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}


.movie-box {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  position: relative;
}

@media (min-width: 768px) {
  .movie-box {
    flex-direction: row;
    align-items: flex-start;
  }
}

.trailer-image {
  display: none;
}

.trailer-image-mobile {
  width: 4rem;
  margin-left: 1rem;
  margin-top: 2.5rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  cursor: pointer;
}

@media (min-width: 768px) {
  .trailer-image {
    display: block;
    width: 18rem;
    border-radius: 0.75rem;
    margin-right: 2.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  .trailer-image-mobile {
    display: none;
  }
}

.title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .title-row {
    display: block;
  }
}

.title-meta {
  flex: 1;
}

.movie-details {
  max-width: 40rem;
  position: relative;
  flex: 1;
}

.favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 10;
  font-size: 1.2rem;
  line-height: 1;
}

.favorite-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.movie-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .movie-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

.movie-meta {
  font-size: 0.875rem;
  color: #ccc;
  margin-bottom: 0.75rem;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.genre-tag {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 500;
  white-space: nowrap;
  color: #fff;
  opacity: 0.95;
  transition: background-color 0.3s ease;
}

.genre-tag:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.movie-description {
  font-size: 0.875rem;
  color: #fff;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.movie-info {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.label {
  color: #aaa;
}

.trailer-embed {
  margin-top: 1.5rem;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.trailer-embed iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>