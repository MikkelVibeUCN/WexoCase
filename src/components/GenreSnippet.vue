<template>
  <div class="genre-snippet">
    <div class="genre-header">
      <div class="title-wrapper">
        <h2 class="genre-title">{{ genreName }}</h2>
        <span class="genre-total">({{ totalResults ?? '...' }})</span>
      </div>
      <router-link class="view-all-button" :to="{ name: 'genre', params: { id: genreId } }">
        View All →
      </router-link>
    </div>

    <div class="movie-row-wrapper">
      <button v-if="canScrollLeft" class="scroll-button left" @click="scrollLeft">
        <img src="/scroll.png" alt="Scroll Left" class="scroll-icon flipped" />
      </button>

      <div class="movie-row" ref="scrollContainer" @scroll="handleScroll">
        <movie
          v-for="movie in movies"
          :key="movie.id"
          :id="movie.id"
          :title="movie.title"
          :imageUrl="movie.trailerImageUrl"
          :genres="movie.genres"
          :rating="movie.rating"
          width="160px"
        />
      </div>

      <button v-if="canScrollRight" class="scroll-button right" @click="scrollRight">
        <img src="/scroll.png" alt="Scroll Right" class="scroll-icon" />
      </button>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import movie from './Shared/movie.vue'
import { type MovieShort, MovieService } from '../Services/MovieService.ts'
import { AccountService } from '../Services/AccountService.ts';

const props = defineProps<{
  genreName: string
  genreId: number
}>()

const scrollContainer = ref<HTMLDivElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const movies = ref<MovieShort[]>([])
const currentPage = ref(1)
const hasMore = ref(true)
const isLoading = ref(false)
const totalResults = ref<number | null>(null)

const fetchMovies = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  try {
    let { movies: newMovies, total } = await MovieService.getMoviesFromGenreId(
      props.genreId,
      currentPage.value
    )

    newMovies = newMovies.filter(movie => movie.trailerImageUrl !== "")


    if (totalResults.value === null) {
      totalResults.value = total // only set on first fetch
    }

    if (newMovies.length > 0) {
      movies.value.push(...newMovies)
      currentPage.value += 1
    } else {
      hasMore.value = false
    }
  } catch (e) {
    console.error('Failed to fetch movies:', e)
  } finally {
    isLoading.value = false
    await nextTick()
    updateScrollButtons()
  }
}

const updateScrollButtons = () => {
  const el = scrollContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth
}

const scrollLeft = () => {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

const scrollRight = async () => {
  const el = scrollContainer.value
  if (!el) return

  const scrollAmount = el.clientWidth * 0.15
  el.scrollBy({ left: scrollAmount, behavior: 'smooth' })

  const scrollThreshold = el.scrollWidth * 0.75

  if (el.scrollLeft + el.clientWidth >= scrollThreshold) {
    await fetchMovies()
  }
}


const handleScroll = () => {
  updateScrollButtons()
}

onMounted(async () => {
  try {
    await AccountService.initializeSession()
    await MovieService.loadFavoriteIdsIfNeeded()
  } catch (err) {
    console.warn('Failed to load favorite IDs', err)
  }
  await fetchMovies()
})
</script>

<style scoped>
.genre-snippet {
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  box-sizing: border-box;
  z-index: 1;
}

/* Header */
.genre-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.title-wrapper {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.genre-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

.genre-total {
  font-size: 0.95rem;
  color: #aaa;
}

.view-all-button {
  font-size: 0.9rem;
  background-color: transparent;
  color: #fff;
  border: 1px solid #444;
  padding: 0.35rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.view-all-button:hover {
  background-color: #222;
}

/* Movie Row */
.movie-row-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.movie-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 1rem;
  padding-bottom: 20px;
  scroll-snap-type: x mandatory;
  box-sizing: border-box;
  max-width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-grow: 1;
}

.movie-row > * {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.movie-row::-webkit-scrollbar {
  display: none;
}

/* Scroll Buttons */
.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.scroll-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.scroll-button.left {
  left: 0.75rem;
}

.scroll-button.right {
  right: 0.75rem;
}

.scroll-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  display: block;
}

.scroll-icon.flipped {
  transform: scaleX(-1);
}

</style>
