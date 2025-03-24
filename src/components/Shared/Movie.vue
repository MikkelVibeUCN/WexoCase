<template>
    <div
      class="movie-card"
      :style="{ width }"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <div class="image-wrapper">
        <img :src="imageUrl" :alt="title" :class="{ blurred: hover }" />
        <div class="overlay" :class="{ visible: hover }">
          <h3 class="movie-title">{{ title }}</h3>
          <p class="movie-runtime">{{ runtime }}</p>
  
          <div class="genre-tags">
            <span class="genre-tag" v-for="(genre, i) in genres" :key="i">
              {{ genre }}
            </span>
          </div>
  
          <p class="movie-rating">{{ rating }}/10 ⭐</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  id: number
  imageUrl: string
  title: string
  runtime: string // e.g., "2h 15m"
  genres: string[] // e.g., ["Action", "Drama"]
  rating: number
  width?: string
}>()

const hover = ref(false)
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
  filter: blur(4px) brightness(0.5);
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
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
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
  font-size: 0.75rem;
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
  font-size: 0.9rem;
}

  </style>
  