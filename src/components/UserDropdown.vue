<template>
    <div
      ref="dropdownRef"
      class="user-dropdown-wrapper"
      @click="toggleMenu"
    >
      <div class="icon-button">
        <icon :ImgWidth="30" :ImgHeight="30" srcImage="/UserIcon.svg" />
      </div>
  
      <transition name="slide-down">
        <div v-if="userMenuOpen" class="dropdown-panel">
          <div v-if="isLoggedIn" class="user-info">
            <img :src="user!.avatarUrl" alt="Avatar" class="user-avatar" />
            <div class="user-details">
              <p class="user-name">{{ user!.name }}</p>
              <p class="user-username">@{{ user!.username }}</p>
            </div>
            <router-link class="user-link" to="/favorites">★ Favorites</router-link>
            <button class="user-link" @click="handleLogout">Log Out</button>
          </div>
          <div v-else>
            <button class="user-link" @click="loginWithTMDB">Log in with TMDB</button>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  import icon from './Shared/icon.vue'
  import { AccountService } from '../Services/AccountService'
  
  const router = useRouter()
  const userMenuOpen = ref(false)
  const dropdownRef = ref<HTMLElement | null>(null)
  
  const user = computed(() => AccountService.user)
  const isLoggedIn = computed(() => AccountService.isLoggedIn)
  
  function toggleMenu() {
    userMenuOpen.value = !userMenuOpen.value
  }
  
  function handleClickOutside(event: MouseEvent) {
    const el = dropdownRef.value
    if (el && !el.contains(event.target as Node)) {
      userMenuOpen.value = false
    }
  }
  
  function handleLogout() {
    AccountService.logout()
    userMenuOpen.value = false
    router.push('/')
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    AccountService.initializeSession()
  })
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  async function loginWithTMDB() {
    const token = await import('../Services/AuthService').then(m => m.AuthService.createRequestToken())
    const redirect = encodeURIComponent('http://localhost:5173/')
    window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${redirect}`
  }
  </script>
  
  
  <style scoped>
  .user-dropdown-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .icon-button {
    position: relative;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 6px;
  }
  
  .icon-button::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0);
    transition: background-color 0.2s ease;
    pointer-events: none;
    z-index: 1;
    border-radius: 6px;
  }
  
  .icon-button:hover::after {
    background-color: rgba(255, 255, 255, 0.08);
  }
  
  .icon-button > * {
    position: relative;
    z-index: 2;
  }
  
  .dropdown-panel {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background-color: #1e1e1e;
    border: 1px solid #333;
    padding: 1rem;
    width: 220px;
    z-index: 999;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.5rem;
  }
  
  .user-details {
    text-align: center;
  }
  
  .user-name {
    font-weight: bold;
    font-size: 1rem;
    margin: 0;
  }
  
  .user-username {
    font-size: 0.85rem;
    opacity: 0.8;
    margin: 0;
  }
  
  .user-link {
    margin-top: 0.5rem;
    padding: 0.4rem 0.6rem;
    text-align: center;
    background-color: #333;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.2s;
  }
  
  .user-link:hover {
    background-color: #444;
  }
  </style>
  