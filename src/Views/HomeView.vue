<template>
    <div class="genres-container" ref="genresContainer">
      <GenreSnippet
        v-for="(genreToAdd, index) in genresToAdd"
        :key="index"
        :genreName="genreToAdd.name"
        :genreId="genreToAdd.id"
      />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import GenreSnippet from '../components/GenreSnippet.vue'
  
  export default defineComponent({
    components: { GenreSnippet },
    data() {
      return {
        genresToAdd: [
          { id: 28, name: "Action" },
          { id: 35, name: "Comedy" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
          { id: 10749, name: "Romance" },
          { id: 18, name: "Drama" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 27, name: "Horror" }
        ]
      }
    },
  })
  </script>

  <style scoped>
.genres-container {
    padding-top: 2%;
}

</style>
  