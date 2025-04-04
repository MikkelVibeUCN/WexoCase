<template>
  <div class="movie-card" :style="{ width }" @mouseenter="preloadOnHover" @mouseleave="hover = false"
    @click="goToMoviePage">
    <div class="image-wrapper">
      <img :src="imageUrl" :alt="title" :class="{ blurred: hover }" />

      <div class="overlay" :class="{ visible: hover }">
        <button v-show="isLoggedIn" class="favorite-icon-btn" :class="{ 'pulse-anim': isAnimating }"
          @click="toggleFavorite">
          <img :src="isFavorited ? '/FavoriteIconOn.png' : '/FavoriteIconOff.png'" alt="Favorite"
            class="favorite-icon-img" :class="{ 'icon-animate': isAnimating }" />
        </button>

        <h3 class="movie-title">{{ title }}</h3>
        <p class="movie-rating">{{ rating }}/10 ⭐</p>
        <div class="genre-tags">
          <span class="genre-tag" v-for="(genre, i) in genres" :key="i">
            {{ genre }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">



import { ref, watchEffect, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AccountService } from '../../Services/AccountService';

const props = defineProps<{
  id: number
  imageUrl: string
  title: string
  genres: string[] // e.g., ["Action", "Drama"]
  rating: number
  width?: string
}>()

const { id } = props

// Emit to animate
const emit = defineEmits<{
  (e: 'favorite-toggled', payload: { id: number; isFavorited: boolean }): void
}>()

const router = useRouter()
const hover = ref(false)

function goToMoviePage() {
  router.push(`/movie/${id}`)
}

import { MovieService } from '../../Services/MovieService';

// Cache movie when hovered
function preloadOnHover() {
  hover.value = true
  MovieService.preloadMovieDetails(props.id).catch((err) => {
    console.warn('Preload failed', err)
  })
}

const isLoggedIn = computed(() => AccountService.isLoggedIn)
const isFavorited = ref(false)
const isAnimating = ref(false)

watchEffect(() => {
  isFavorited.value = isLoggedIn && MovieService.isMovieInFavorites(props.id)
})


async function toggleFavorite(e: MouseEvent) {
  e.stopPropagation()

  if (!isLoggedIn) {
    alert('Please log in to use favorites.')
    return
  }

  const newStatus = !isFavorited.value
  isFavorited.value = newStatus

  isAnimating.value = true
  setTimeout(() => (isAnimating.value = false), 400)

  try {
    await AccountService.addMovieToFavorites(
      AccountService.user!.id,
      AccountService.sessionId!,
      props.id,
      newStatus
    )

    MovieService.updateFavoriteLocally(props.id, newStatus)

    // ✅ Tell the parent
    emit('favorite-toggled', { id: props.id, isFavorited: newStatus })

  } catch (err) {
    console.error('Failed to update favorite', err)
    isFavorited.value = !newStatus
  }
}

</script>


<style scoped>
.movie-card {
  aspect-ratio: 2 / 3;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background-color: #111;
  cursor: pointer;
  box-shadow: 10px 10px 9.6px 0px rgba(0, 0, 0, 1);

}

.movie-card:hover .image-wrapper img {
  transform: scale(1.03);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease, transform 0.3s ease;
  display: block;
}

.image-wrapper img.blurred {
  filter: blur(2px) brightness(0.9);
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

.movie-title {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  text-align: center;
}

.movie-runtime {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.genre-tag {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.6rem;
  white-space: nowrap;
  color: #fff;
  opacity: 0.9;
  transition: background-color 0.3s ease;
}

.genre-tag:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.movie-rating {
  font-weight: bold;
  color: #facc15;
  font-size: 0.8rem;
  text-align: center;
}

.favorite-icon-btn {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background: #1e1e1e;
  border-radius: 50%;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 3;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: background 0.2s ease;
  overflow: hidden;
}

.favorite-icon-btn:hover {
  background: #2a2a2a;
}

.favorite-icon-img {
  width: 20px !important;
  height: 20px !important;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
  transform-origin: center;
}



@keyframes iconPulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px #facc15);
  }

  50% {
    transform: scale(1.6);
    filter: drop-shadow(0 0 12px #facc15);
  }

  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px #facc15);
  }
}

.icon-animate {
  animation: iconPulse 0.4s ease-out;
}
</style>