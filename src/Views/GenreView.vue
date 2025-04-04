<template>
    <div class="genre-view">
        <div class="genre-header">
            <div class="genre-dropdown" @click="isDropdownOpen = !isDropdownOpen" @blur="isDropdownOpen = false"
                tabindex="0">
                <div class="dropdown-label">
                    {{ activeGenre?.name || 'Select Genre' }}
                    <img src="/DropDownIcon.svg" alt="Dropdown Arrow" class="dropdown-arrow" />

                </div>
                <ul v-if="isDropdownOpen" class="dropdown-list">
                    <li v-for="genre in genres" :key="genre.id" class="dropdown-item"
                        @click.stop="selectGenre(genre.id)">
                        {{ genre.name }}
                    </li>
                </ul>
            </div>
            <span class="genre-total">({{ totalResults ?? '...' }} movies)</span>
        </div>

        <div class="movie-grid">
            <movie v-for="movie in movies" :key="movie.id" :id="movie.id" :title="movie.title"
                :imageUrl="movie.trailerImageUrl" :genres="movie.genres" :rating="movie.rating" width="160px" />
        </div>

        <div ref="loadMoreTrigger" class="scroll-trigger"></div>
        <div v-if="isLoading" class="loading">Loading...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import movie from '../components/Shared/movie.vue'
import { MovieService, type MovieShort } from '../Services/MovieService'
import { GenreService, type Genre } from '../Services/GenreService'

// Router
const route = useRoute()
const router = useRouter()

// Genre state
const genres = ref<Genre[]>([])
const selectedGenreId = ref<number | null>(null)
const activeGenre = computed<Genre | null>(() =>
    genres.value.find((g) => g.id === selectedGenreId.value) ?? null
)

// Movie state
const movies = ref<MovieShort[]>([])
const currentPage = ref<number>(1)
const totalResults = ref<number | null>(null)
const hasMore = ref<boolean>(true)
const isLoading = ref<boolean>(false)

// Ref for intersection observer
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupObserver = () => {
    if (observer) observer.disconnect()

    observer = new IntersectionObserver(
        async ([entry]) => {
            if (entry.isIntersecting && hasMore.value && !isLoading.value) {
                await fetchMovies()
            }
        },
        {
            root: null,
            rootMargin: '200px',
            threshold: 0.1
        }
    )

    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value)
    }
}

// Fetch all genres
const fetchGenres = async () => {
    const allGenres = await GenreService.fetchGenres()
    genres.value = allGenres

    const routeGenreId = parseInt(route.params.id as string)
    if (!isNaN(routeGenreId)) {
        selectedGenreId.value = routeGenreId
    } else if (allGenres.length) {
        selectedGenreId.value = allGenres[0].id
        router.replace({ name: 'genre', params: { id: selectedGenreId.value } })
    }
}

// Fetch movies from current genre
const fetchMovies = async (): Promise<void> => {
    if (
        isLoading.value ||
        selectedGenreId.value === null ||
        !hasMore.value
    ) return

    isLoading.value = true
    try {
        const { movies: newMovies, total } = await MovieService.getMoviesFromGenreId(
            selectedGenreId.value,
            currentPage.value
        )

        const filteredMovies = newMovies.filter((movie) => movie.trailerImageUrl !== '')

        if (totalResults.value === null) {
            totalResults.value = total
        }

        if (filteredMovies.length > 0) {
            movies.value.push(...filteredMovies)
            currentPage.value++
        } else {
            hasMore.value = false
        }
    } catch (error) {
        console.error('Error fetching movies:', error)
    } finally {
        isLoading.value = false
    }
}

// On genre dropdown change
const onGenreChange = (): void => {
    if (selectedGenreId.value !== null) {
        router.push({ name: 'genre', params: { id: selectedGenreId.value } })
    }
}
const isDropdownOpen = ref(false)

const selectGenre = (id: number) => {
    isDropdownOpen.value = false
    selectedGenreId.value = id
    onGenreChange()
}


// Reset on genre change
const resetMovies = (): void => {
    movies.value = []
    currentPage.value = 1
    totalResults.value = null
    hasMore.value = true
}

// Watch for route change
watch(
    () => route.params.id,
    async (newId) => {
        const newGenreId = parseInt(newId as string)
        if (!isNaN(newGenreId)) {
            selectedGenreId.value = newGenreId
            resetMovies()
            await fetchMovies()
            setupObserver()
        }
    }
)

// Initial load
onMounted(async () => {
    await fetchGenres()
    if (selectedGenreId.value !== null) {
        await fetchMovies()
    }
    setupObserver()
})

// Cleanup
onBeforeUnmount(() => {
    if (observer) observer.disconnect()
})
</script>

<style scoped>
.genre-view {
    padding: 2rem;
    padding-top: 5rem;
    max-width: 1280px;
    margin: auto;
}

.genre-selector {
    margin-bottom: 1.5rem;
}

.genre-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.genre-header h1 {
    font-size: 2rem;
    font-weight: bold;
}

.genre-total {
    font-size: 1.1rem;
    color: #888;
}

.movie-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-start;
}

.scroll-trigger {
    height: 1px;
    width: 100%;
}

.loading {
    text-align: center;
    margin-top: 2rem;
    font-size: 1.1rem;
    color: #888;
}

.genre-dropdown {
    position: relative;
    width: fit-content;
    background-color: #1e1e1e;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    user-select: none;
    margin-bottom: 2rem;
    color: #f0f0f0;
    font-size: 1rem;
    outline: none;
}

.dropdown-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.dropdown-arrow {
    font-size: 0.8rem;
    color: #aaa;
}

.dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #1e1e1e;
    border: 1px solid #444;
    border-radius: 6px;
    margin-top: 0.25rem;
    padding: 0.25rem 0;
    max-height: 300px;
    overflow-y: auto;
    z-index: 5;

    width: max-content;
    min-width: 100%;
    max-width: 400px;

}

.dropdown-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: #eee;
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: #333;
}
</style>