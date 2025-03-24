<template>
  <nav class="navbar">
    <Icon srcImage="/Icon.png" />

    <ul class="nav-items">
      
      <router-link class="nav-item" v-for="(item, index) in navbarItems" :key="index" :to="item.route">
        {{ item.displayText }}
      </router-link>

      <li
        class="nav-item dropdown"
        @mouseenter="isGenresOpen = true"
        @mouseleave="isGenresOpen = false"
      >
        Genres
        <ul v-if="isGenresOpen" class="dropdown-menu">
          <li class="dropdown-item" v-for="(genre, i) in genres" :key="i">
            {{ genre.name }}
          </li>
          
        </ul>
        <Icon :ImgWidth="10" :ImgHeight="5" srcImage="/DropDownIcon.svg" />
      </li>

      <li class="nav-item">
        <Icon :ImgWidth="23" :ImgHeight="23" srcImage="/UserIcon.svg" />
      </li>
    </ul>
  </nav>
</template>
  
<script>
import Icon from './Shared/Icon.vue';
import { GenreService } from '../Services/GenreService.ts';

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
      ]
    };
  },
  async mounted() {
    this.genres = await GenreService.fetchGenres();
  }
}
</script>

  
  <style scoped>
  .navbar {
    background-color: #000000;
    border-bottom: 7px solid #0D0D0D;
    width: 100vw;
    top: 0;
    position: fixed;
    margin-left: -50vw;
    margin-right: -50vw;

    left: 50%;
    right: 50%;


    display: flex;
    align-items: center;
    justify-content: space-between;
    

    box-sizing: border-box;
    padding: 0.5rem 1rem;
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
  }
  
  .nav-item:hover {
    opacity: 0.8;
  }

.router-link-active {
  font-weight: bold;
}
  .dropdown {
  position: relative;
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
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  min-width: 100%; /* At least as wide as "Genres" */
  width: max-content; /* Expand to fit longest item */
}

.dropdown-item {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #333;
}

  </style>