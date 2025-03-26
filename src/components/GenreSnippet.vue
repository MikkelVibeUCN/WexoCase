<template>
  <div class="genre-snippet">
    <div class="genre-header">
      <h2 class="genre-title">{{ genreName }}</h2>
      <span class="genre-total">({{ movies.length }})</span>
    </div>

    <div class="movie-row-wrapper">
      <button
        v-if="canScrollLeft"
        class="scroll-button left"
        @click="scrollLeft"
      >
        ◀
      </button>

      <div class="movie-row" ref="scrollContainer" @scroll="handleScroll">
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

      <button
        v-if="canScrollRight"
        class="scroll-button right"
        @click="scrollRight"
      >
        ▶
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import MovieCard from './Shared/Movie.vue'

const props = defineProps<{
  genreName: string
  genreId: number
  movies: {
    id: number
    title: string
    imageUrl: string
    runtime: string
    genres: string[]
    rating: number
  }[]
}>()

watch(
  () => props.movies,
  async () => {
    await nextTick()
    updateScrollButtons()
  },
  { immediate: true }
)


const scrollContainer = ref<HTMLDivElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const updateScrollButtons = () => {
  const el = scrollContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth
}

const scrollLeft = () => {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

const scrollRight = () => {
  scrollContainer.value?.scrollBy({ left: 300, behavior: 'smooth' })
}

const handleScroll = () => {
  updateScrollButtons()
}

onMounted(async () => {
  await nextTick()
  updateScrollButtons()
})


</script>

<style scoped>
.genre-snippet {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  padding-left: 2rem;
  box-sizing: border-box;
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
  scrollbar-width: none; 
  -ms-overflow-style: none; 
}

.movie-row > * {
  flex: 0 0 auto;
  scroll-snap-align: start;
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


.scroll-button {
  position: absolute;
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

.scroll-button.left {
  left: 0.5rem;
}

.scroll-button.right {
  right: 0.5rem;
}

</style>
