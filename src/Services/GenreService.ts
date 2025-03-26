
import { Service } from "./Service.ts";
import { MapDataToMovies } from "./Mapper.ts";
import type { Movie } from "./Mapper.ts";

export class GenreService extends Service {
    static async fetchGenres(): Promise<Genre[]> {
        try {
            const response = await fetch(`${Service.BASE_URL}/genre/movie/list`, {
                method: 'GET',
                headers: Service.headers
            });
            const data = await response.json();
            return data.genres;
        }
        catch {
            console.error('Failed to get genres');
            return [];
        }
    }

    static async getMoviesFromGenreId(id: number, page: number): Promise<Movie[]> {
        try {
            const url = `${Service.BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&vote_count.gte=30&with_genres=${id}`;

            console.log(url);

            const response = await fetch(url, {
                method: 'GET',
                headers: Service.headers
            });
            const data = await response.json();
            const genres = await this.fetchGenres();
            return MapDataToMovies(data.results, genres);
        }
        catch {
            console.error('Failed to get movies from genre');
            return [];
        }
    }
}

export interface Genre {
    id: number;
    name: string;
}

