<template>
    <div class="genres-container" >
        <GenreSnippet v-for="(genreToAdd, index) in genresToAdd" :key="index"
        :genreName="genreToAdd.name"
        :movies="genreToAdd.movies"
        />
    </div>
    
</template>

<script lang="ts">
import GenreSnippet from '../components/GenreSnippet.vue';
import { GenreService } from '../Services/GenreService';
import type { Movie } from '../Services/Mapper';

export default {
    components: {
        GenreSnippet,
    },
    data() {
        return {
            genresToAdd: [
                { id: 28, "name": "Action", movies: [] as Movie[]},
                { id: 35, "name": "Comedy", movies: [] as Movie[] },
                { id: 53, "name": "Thriller", movies: [] as Movie[] },
                { id: 10752, "name": "War", movies: [] as Movie[] },
                { id: 10749, "name": "Romance", movies: [] as Movie[] },
                { id: 18, "name": "Drama", movies: [] as Movie[] },
                { id: 80, "name": "Crime", movies: [] as Movie[] },
                { id: 99, "name": "Documentary", movies: [] as Movie[] },
                { id: 27, "name": "Horror", movies: [] as Movie[] }
            ]
        };
    },
    async created() {
        this.genresToAdd.forEach(async element => {
            element.movies = await this.getMovies(element.id, 1)
        });
    },
    methods: {
        async getMovies(id: number, page: number) {
            return await GenreService.getMoviesFromGenreId(id, page);
        }
    }
}

</script>