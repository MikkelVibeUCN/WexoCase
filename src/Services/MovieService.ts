import { reactive } from 'vue'
import { GenreService } from "./GenreService";
import { MapDataToMovies } from "./Mapper";
import { getFullImagePath } from "./ImageService";
import { AccountService } from "./AccountService";
import { ServiceClient } from './ServiceClient';

// Detailed moviecache, also could be updated so it cant grow infinitely
const movieCache = new Map<number, MovieDetailed>()

// Array of favorite movies cached, this could get ugly if the user has a lot of movies, but pagination could easily be added in the future
var favoriteMovies: MovieShort[] = []

// Favorite state allows other components to watch it and update their data if it changes
export const favoriteState = reactive({ version: 0 })

let favoritesFetched = false

// Card view data for movies
export interface MovieShort {
  id: number
  trailerImageUrl: string
  title: string
  genres: string[]
  rating: number
}

// Detailed movie for the MovieView
export interface MovieDetailed extends MovieShort {
  backDropImageUrl: string
  releaseYear: number
  runtime: number
  trailerUrl: string
  age: string
  directorName: string
  top3Crew: string
  description: string
}

export class MovieService {
  static async getMoviesFromGenreId(id: number, page: number): Promise<{ movies: MovieShort[], total: number }> {
    try {
      const url = `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=revenue.desc&vote_count.gte=10&with_genres=${id}`;
      const data = await ServiceClient.get(url)
      const genres = await GenreService.fetchGenres()
      const movies = MapDataToMovies(data.results, genres)
      return { movies, total: data.total_results }
    } catch {
      console.error('Failed to get movies from genre')
      return { movies: [], total: 0 }
    }
  }

  static async getAllMovieDetails(id: number): Promise<MovieDetailed> {
    try {
      // Release info
      const releaseData = await ServiceClient.get(`/movie/${id}/release_dates`)
      const dkRelease = releaseData.results.find((r: any) => r.iso_3166_1 === "DK")
      const usFallback = releaseData.results.find((r: any) => r.iso_3166_1 === "US")

      // Rating
      const ratingEntry = (dkRelease ?? usFallback)?.release_dates?.[0]
      const age = ratingEntry?.certification ?? "N/A"

      // Credits to get director and the first 3 actors (they are ordered in popularity)
      const credits = await ServiceClient.get(`/movie/${id}/credits?language=en-US`)

      const director = credits.crew.find((c: any) => c.job === "Director")?.name ?? "Unknown"
      const top3Crew = credits.cast.slice(0, 3).map((c: any) => c.name).join(", ")

      // Trailer setting, looking for YouTube with Trailer as type and has to be official (gets the newest one)
      const videoData = await ServiceClient.get(`/movie/${id}/videos`)

      const youtubeTrailer = videoData.results
        .filter((v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official)
        .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0]

      const movieDetails = await ServiceClient.get(`/movie/${id}?language=en-US`)

      return {
        id: movieDetails.id,
        title: movieDetails.title,
        description: movieDetails.overview,
        trailerImageUrl: getFullImagePath(movieDetails.poster_path),
        backDropImageUrl: getFullImagePath(movieDetails.backdrop_path),
        genres: movieDetails.genres.map((g: any) => g.name),
        rating: movieDetails.vote_average,
        runtime: movieDetails.runtime,
        releaseYear: Number(movieDetails.release_date?.slice(0, 4)) || 0, // Only include year
        age,
        directorName: director,
        top3Crew,
        trailerUrl: youtubeTrailer ? `https://www.youtube.com/embed/${youtubeTrailer.key}` : ""
      }
    } catch (e) {
      console.error('Failed to get movies from genre')
      throw e
    }
  }

  // Preloads the movie with all details if it isnt already in the cache
  static async preloadMovieDetails(id: number): Promise<MovieDetailed> {
    if (movieCache.has(id)) return this.getCachedMovie(id)!

    const movie = await this.getAllMovieDetails(id)
    movieCache.set(id, movie)

    return movie
  }

  static getCachedMovie(id: number): MovieDetailed | null {
    return movieCache.get(id) ?? null
  }

  static async loadFavoriteMoviesIfNeeded(): Promise<void> {
    if (favoritesFetched) return
  
    const sessionId = AccountService.sessionId
    const account = AccountService.user
  
    if (!sessionId || !account) {
      console.warn("Session ID or account missing – cannot fetch favorites.")
      return
    }
  
    let page = 1
    let totalPages = 1
  
    const genres = await GenreService.fetchGenres()
  
    try {
      while (page <= totalPages) {
        const url = `/account/${account.id}/favorite/movies?language=en-US&sort_by=created_at.asc&page=${page}&session_id=${sessionId}`
        const data = await ServiceClient.get(url)
        totalPages = data.total_pages ?? 1
  
        for (const movie of data.results) {
          const alreadyInFavorites = favoriteMovies.some(m => m.id === movie.id)
          if (alreadyInFavorites) continue
  
          favoriteMovies.push({
            id: movie.id,
            title: movie.title,
            trailerImageUrl: getFullImagePath(movie.poster_path),
            genres: movie.genre_ids?.map((genreId: number) =>
              genres.find(g => g.id === genreId)?.name || ''
            ) ?? [],
            rating: movie.vote_average,
          })
        }
  
        page++
      }
  
      favoritesFetched = true
      favoriteState.version++
    } catch (e) {
      console.error('Failed to fetch favorite movies', e)
    }
  }
  

  static clearFavoriteCache() {
    favoriteMovies.splice(0, favoriteMovies.length)
    favoritesFetched = false
    favoriteState.version++
  }

  static isMovieInFavorites(id: number): boolean {
    return favoriteMovies.some(m => m.id === id)
  }

  static async updateFavoriteLocally(id: number, hasValue: boolean): Promise<void> {
    const index = favoriteMovies.findIndex(m => m.id === id)
  
    if (hasValue && index === -1) {
      favoriteMovies.push(await this.getAllMovieDetails(id) as MovieShort)
    } else if (!hasValue && index !== -1) {
      favoriteMovies.splice(index, 1)
    }
  
    favoriteState.version++
  }
  
  static async getFavoriteMovies(): Promise<MovieShort[]> {
    await this.loadFavoriteMoviesIfNeeded()
    return favoriteMovies
  }
}