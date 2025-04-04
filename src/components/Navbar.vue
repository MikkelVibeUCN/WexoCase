<template>
  <transition name="navbar-slide">
    <nav v-if="showNavbar" class="navbar">
      <router-link to="/" class="logo-link">
        <img src="/Icon.png" class="logo" />
      </router-link>

      <div class="nav-right">
        <ul class="nav-items">
          <router-link class="nav-item" v-for="(item, index) in navbarItems" :key="index" :to="item.route">
            {{ item.displayText }}
          </router-link>

          <li class="nav-item dropdown" @click="isGenresOpen = !isGenresOpen" @mouseleave="isGenresOpen = false">
            Genres
            <transition name="slide-down">
              <ul v-if="isGenresOpen" class="dropdown-menu">
                <router-link v-for="(genre, i) in genres" :key="i" :to="{ name: 'genre', params: { id: genre.id } }"
                  class="dropdown-item" @click="isGenresOpen = false" custom v-slot="{ navigate, href }">
                  <li :href="href" @click="navigate">
                    {{ genre.name }}
                  </li>
                </router-link>
              </ul>
            </transition>

            <Icon :ImgWidth="10" :ImgHeight="5" srcImage="/DropDownIcon.svg" />
          </li>
        </ul>

        <div class="profile-wrapper">
          <UserDropdown />
        </div>
      </div>
    </nav>
  </transition>
</template>

<script>
import Icon from './Shared/icon.vue'
import UserDropdown from './userDropdown.vue'
import { GenreService } from '../Services/GenreService.ts'

export default {
  components: {
    Icon,
    UserDropdown
  },
  data() {
    return {
      isGenresOpen: false,
      genres: [],
      navbarItems: [
        { displayText: 'Home', route: '/' }
      ],
      showNavbar: true,
      lastScrollY: 0
    }
  },
  async mounted() {
    this.genres = await GenreService.fetchGenres()
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const currentY = window.scrollY
      this.showNavbar = currentY < 20 || currentY < this.lastScrollY
      this.lastScrollY = currentY
    }
  }
}
</script>

<style scoped>
/* NAVBAR STYLING */
.navbar {
  background-color: #000000;
  border-bottom: 7px solid #0D0D0D;
  width: 100vw;
  height: 10%;
  top: 0;
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 50;
  box-sizing: border-box;
  padding: 0.5rem 2rem;
}

/* TRANSITION FIX */
.navbar-slide-enter-active,
.navbar-slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.navbar-slide-enter-from,
.navbar-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.navbar-slide-enter-to,
.navbar-slide-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

/* LOGO */
.logo {
  width: 10rem;
  height: auto;
}

.logo-link {
  display: flex;
  align-items: center;
}

/* RIGHT SIDE */
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* NAV ITEMS */
.nav-items {
  display: flex;
  gap: 1rem;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.nav-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0);
  transition: background-color 0.2s ease;
  pointer-events: none;
  z-index: 1;
}

.nav-item:hover::after {
  background-color: rgba(255, 255, 255, 0.08);
}

.nav-item>* {
  position: relative;
  z-index: 2;
}

.router-link-active {
  font-weight: bold;
}

/* DROPDOWN */
.dropdown {
  position: relative;
  gap: 5px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1e1e1e;
  border: 1px solid #333;
  padding: 0.5rem 0;
  list-style: none;
  margin: 0;
  z-index: 11;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  min-width: 100%;
  width: max-content;
  transition: all 0.3s ease;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.dropdown-item:hover {
  background-color: #333;
}

/* Profile container */
.profile-wrapper {
  position: relative;
}

/* Dropdown animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 500px;
}
</style>
