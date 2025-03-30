import { GenreService } from "./GenreService";
import { Service } from "./Service"
import { MapDataToMovies } from "./Mapper";
import { getFullImagePath } from "./ImageService";
import { AccountService } from "./AccountService";

const movieCache = new Map<number, MovieDetailed>()

export interface MovieShort {
    id: number
    trailerImageUrl: string
    title: string
    genres: string[]
    rating: number
}

export interface MovieDetailed extends MovieShort {
    backDropImageUrl: string, // details
    releaseYear: number, // details
    runtime: number, // details
    trailerUrl: string,
    age: string, // https://developer.themoviedb.org/reference/movie-release-dates  DK or "iso_3166_1": "US"
    directorName: string, // "job": "Director" https://developer.themoviedb.org/reference/movie-credits
    top3Crew: string,
    description: string
}


export class MovieService extends Service {
    static async getMoviesFromGenreId(id: number, page: number): Promise<{ movies: MovieShort[], total: number }> {
        try {
            const url = `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=revenue.desc&vote_count.gte=10&with_genres=${id}`;

            const data = await this.fetchFromApi(url);
            const genres = await GenreService.fetchGenres();
            const movies = MapDataToMovies(data.results, genres);
            return { movies, total: data.total_results };
        }
        catch {
            console.error('Failed to get movies from genre');
            return { movies: [], total: 0 };
        }
    }


    static async getAllMovieDetails(id: number): Promise<MovieDetailed> {
        try {
            // Get base movie details
            const movieDetails = await this.fetchFromApi(`/movie/${id}?language=en-US`);

            // Get release dates for age rating
            const releaseData = await this.fetchFromApi(`/movie/${id}/release_dates`);
            const dkRelease = releaseData.results.find((r: any) => r.iso_3166_1 === "DK");
            const usFallback = releaseData.results.find((r: any) => r.iso_3166_1 === "US");
            const ratingEntry = (dkRelease ?? usFallback)?.release_dates?.[0];
            const age = ratingEntry?.certification ?? "N/A";

            // Get credits to extract director and first 3 crew
            const credits = await this.fetchFromApi(`/movie/${id}/credits?language=en-US`);
            const director = credits.crew.find((c: any) => c.job === "Director")?.name ?? "Unknown";
            const top3Crew = credits.cast.slice(0, 3).map((c: any) => c.name).join(", ");

            const videoData = await this.fetchFromApi(`/movie/${id}/videos`);

            const youtubeTrailer = videoData.results
                .filter((v: any) =>
                    v.site === "YouTube" &&
                    v.type === "Trailer" &&
                    v.official === true
                )
                .sort((a: any, b: any) =>
                    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
                )[0];

            const detailed: MovieDetailed = {
                id: movieDetails.id,
                title: movieDetails.title,
                description: movieDetails.overview,
                trailerImageUrl: getFullImagePath(movieDetails.poster_path),
                backDropImageUrl: getFullImagePath(movieDetails.backdrop_path),
                genres: movieDetails.genres.map((g: any) => g.name),
                rating: movieDetails.vote_average,
                runtime: movieDetails.runtime,
                releaseYear: Number(movieDetails.release_date?.slice(0, 4)) || 0,
                age,
                directorName: director,
                top3Crew,
                trailerUrl: youtubeTrailer ? `https://www.youtube.com/embed/${youtubeTrailer.key}` : ""
            };

            return detailed;
        }
        catch (e) {
            console.error('Failed to get movies from genre');
            throw e;
        }
    }

    static async preloadMovieDetails(id: number): Promise<MovieDetailed> {
        if (movieCache.has(id)) {
            return movieCache.get(id)!
        }

        const movie = await this.getAllMovieDetails(id)
        movieCache.set(id, movie)
        return movie
    }

    static getCachedMovie(id: number): MovieDetailed | null {
        return movieCache.get(id) ?? null
    }

    static async getFavoriteMovies(): Promise<MovieShort[]> {
        const sessionId = AccountService.sessionId
        const account = AccountService.user
      
        if (!sessionId || !account) throw new Error('User is not logged in')
      
        const url = `/account/${account.id}/favorite/movies?language=en-US&sort_by=created_at.asc&session_id=${sessionId}`
      
        try {
          const data = await this.fetchFromApi(url)
          const genres = await GenreService.fetchGenres()
          return MapDataToMovies(data.results, genres)
        } catch (e) {
          console.error('Failed to fetch favorite movies', e)
          return []
        }
      }
      
}
