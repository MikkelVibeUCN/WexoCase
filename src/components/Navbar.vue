<template>
  <transition name="navbar-fade">
    <nav v-show="showNavbar" class="navbar">
        <router-link to="/">
          <img src="/Icon.png" class="logo">
        </router-link>
      </img>

      <ul class="nav-items">
        <router-link
          class="nav-item"
          v-for="(item, index) in navbarItems"
          :key="index"
          :to="item.route"
        >
          {{ item.displayText }}
        </router-link>

        <li
          class="nav-item dropdown"
          @mouseenter="isGenresOpen = true"
          @mouseleave="isGenresOpen = false"
        >
          Genres
          <transition name="slide-down">
            <ul v-if="isGenresOpen" class="dropdown-menu">
              <li class="dropdown-item" v-for="(genre, i) in genres" :key="i">
                {{ genre.name }}
              </li>
            </ul>
          </transition>
          <Icon :ImgWidth="10" :ImgHeight="5" srcImage="/DropDownIcon.svg" />
        </li>

        <li class="nav-item">
          <Icon :ImgWidth="23" :ImgHeight="23" srcImage="/UserIcon.svg" />
        </li>
      </ul>
    </nav>
  </transition>
</template>

  
<script>
import Icon from './Shared/Icon.vue'
import { GenreService } from '../Services/GenreService.ts'
import { RouterLink } from 'vue-router'

export default {
  components: {
    Icon
  },
  data() {
    return {
      isGenresOpen: false,
      genres: [],
      navbarItems: [
        { displayText: 'Popular', route: '/popular' },
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

      if (currentY < 20) {
        this.showNavbar = true
      } else if (currentY < this.lastScrollY) {
        this.showNavbar = true
      } else {
        this.showNavbar = false
      }

      this.lastScrollY = currentY
    }
  }
}
</script>

<style scoped>
  .navbar {
    background-color: #000000;
    border-bottom: 7px solid #0D0D0D;
    width: 100vw;
    height: 10%;
    top: 0;
    position: fixed;
    margin-left: -50vw;
    margin-right: -50vw;

    left: 50%;
    right: 50%;

    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: opacity 0.4s ease, transform 0.4s ease;
    will-change: opacity, transform;
    z-index: 10;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
  }
  

  .logo {
    width: 10rem;
    height: auto;
    display: flex;
  }
  .nav-items {
    display: flex;
    gap: 1rem;
    align-items: center; 
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-item {
    line-height: 1;
    padding: 0.25rem 0.5rem;
    display: flex;
    height: 100%; 
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.3s ease;
  }
  
  .nav-item:hover {
    opacity: 0.8;
  }



.router-link-active {
  font-weight: bold;
}
  .dropdown {
  position: relative;
  gap: 5px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Move back by 50% of its width */
  
  background-color: #1E1E1E;
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
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease-in, opacity 0.1s ease-out;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 1000px; /* Set high enough to fit all items */
  opacity: 1;
}
.navbar-fade-enter-active,
.navbar-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.navbar-fade-enter-from,
.navbar-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


  </style>