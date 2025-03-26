<template>
    <GenreSnippet
        genreName="Action"
        :movies="movies"
        />
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
            movies: [] as Movie[],
        };
    },
        
    async created() {
        this.movies = await this.getMovies(28, 1);
    },
    methods: {
        async getMovies(id: number, page: number) {
            return await GenreService.getMoviesFromGenreId(id, page);
        }
    }

    
}

</script>