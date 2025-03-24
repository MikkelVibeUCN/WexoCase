<template>
  <div class="genre-snippet">
    <div class="genre-header">
      <h2 class="genre-title">{{ genreName }}</h2>
      <span class="genre-total">({{ movies.length }})</span>
    </div>

    <div class="movie-row-wrapper">
  <!-- Scrollable movie cards -->
  <div class="movie-row" ref="scrollContainer">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :id="movie.id"
      :title="movie.title"
      :imageUrl="movie.imageUrl"
      :runtime="movie.runtime"
      :genres="movie.genres"
      :rating="movie.rating"
      width="160px"
    />
  </div>

  <!-- Scroll Right Button -->
  <button class="scroll-button" @click="scrollRight">▶</button>
</div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MovieCard from './Shared/Movie.vue'

defineProps<{
  genreName: string
  movies: {
    id: number
    title: string
    imageUrl: string
    runtime: string
    genres: string[]
    rating: number
  }[]
}>()



const scrollContainer = ref<HTMLDivElement | null>(null)

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 300, // adjust scroll distance
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.genre-snippet {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}



.genre-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0;
}

.genre-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.genre-total {
  font-size: 0.95rem;
  color: #aaa;
}

.movie-row-wrapper {
  position: relative;
  display: flex;
  align-items: center; /* Vertically center the button with the row */
  overflow: hidden;
  width: 100%;
}


.movie-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 1rem;
  padding: 0;
  scroll-snap-type: x mandatory;
  box-sizing: border-box;
  max-width: 100%;
}

.movie-row > * {
  flex: 0 0 auto;
  scroll-snap-align: start;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}


.movie-row::-webkit-scrollbar {
  display: none;
}

.movie-row {
  height: auto;
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scroll-behavior: smooth;
  flex-grow: 1;
}


/* Fixed scroll-right button */
.scroll-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 999px;
  font-size: 1.2rem;
  color: white;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  transition: background 0.3s ease;
}


.scroll-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
