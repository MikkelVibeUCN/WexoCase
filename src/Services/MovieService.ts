import { reactive } from 'vue'
import { GenreService } from "./GenreService";
import { Service } from "./Service"
import { MapDataToMovies } from "./Mapper";
import { getFullImagePath } from "./ImageService";
import { AccountService } from "./AccountService";

// === Internal reactive favorite state ===
const movieCache = new Map<number, MovieDetailed>()
export const favoriteIdSet = reactive(new Set<number>())
export const favoriteState = reactive({ version: 0 })

let favoritesFetched = false

export interface MovieShort {
  id: number
  trailerImageUrl: string
  title: string
  genres: string[]
  rating: number
}

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

export class MovieService extends Service {
  static async getMoviesFromGenreId(id: number, page: number): Promise<{ movies: MovieShort[], total: number }> {
    try {
      const url = `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=revenue.desc&vote_count.gte=10&with_genres=${id}`;
      const data = await this.fetchFromApi(url)
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
      const movieDetails = await this.fetchFromApi(`/movie/${id}?language=en-US`)
      const releaseData = await this.fetchFromApi(`/movie/${id}/release_dates`)
      const dkRelease = releaseData.results.find((r: any) => r.iso_3166_1 === "DK")
      const usFallback = releaseData.results.find((r: any) => r.iso_3166_1 === "US")
      const ratingEntry = (dkRelease ?? usFallback)?.release_dates?.[0]
      const age = ratingEntry?.certification ?? "N/A"

      const credits = await this.fetchFromApi(`/movie/${id}/credits?language=en-US`)
      const director = credits.crew.find((c: any) => c.job === "Director")?.name ?? "Unknown"
      const top3Crew = credits.cast.slice(0, 3).map((c: any) => c.name).join(", ")

      const videoData = await this.fetchFromApi(`/movie/${id}/videos`)
      const youtubeTrailer = videoData.results
        .filter((v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official)
        .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0]

      return {
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
      }
    } catch (e) {
      console.error('Failed to get movies from genre')
      throw e
    }
  }

  static async preloadMovieDetails(id: number): Promise<MovieDetailed> {
    if (movieCache.has(id)) return movieCache.get(id)!
    const movie = await this.getAllMovieDetails(id)
    movieCache.set(id, movie)
    return movie
  }

  static getCachedMovie(id: number): MovieDetailed | null {
    return movieCache.get(id) ?? null
  }

  static async loadFavoriteIdsIfNeeded(): Promise<void> {
    if (favoritesFetched) return
    

    const sessionId = AccountService.sessionId
    const account = AccountService.user
    if (!sessionId || !account) {
      console.warn("Session ID or account missing – cannot fetch favorites.")
      return
    }
    

    let page = 1
    let totalPages = 1

    while (page <= totalPages) {
      const url = `/account/${account.id}/favorite/movies?language=en-US&sort_by=created_at.asc&page=${page}&session_id=${sessionId}`

      try {
        const data = await this.fetchFromApi(url)
        totalPages = data.total_pages ?? 1

        for (const movie of data.results) {
          favoriteIdSet.add(movie.id)
        }
        favoritesFetched = true
        page++
      } catch (e) {
        console.error('Failed to fetch favorite IDs', e)
        break
      }
    }

    favoriteState.version++ // trigger any watchers
  }

  static clearFavoriteCache() {
    favoriteIdSet.clear()
    favoritesFetched = false
    favoriteState.version++
  }

  static isMovieInFavorites(id: number): boolean {
    return favoriteIdSet.has(id)
  }

  static updateFavoriteLocally(id: number, value: boolean): void {
    if (value) {
      favoriteIdSet.add(id)
    } else {
      favoriteIdSet.delete(id)
    }
    console.log('Updated favorite version:', favoriteState.version)
    console.log('Updated favoriteIdSet:', Array.from(favoriteIdSet))

    favoriteState.version++
  }

  static async getFavoriteMovies(): Promise<MovieShort[]> {
    await this.loadFavoriteIdsIfNeeded()
    const ids = Array.from(favoriteIdSet)

    const movies: MovieShort[] = []

    for (const id of ids) {
      let movie: MovieDetailed

      try {
        movie = await this.preloadMovieDetails(id)
      } catch (err) {
        console.warn(`Failed to load movie details for favorite ID ${id}`, err)
        continue
      }

      movies.push({
        id: movie.id,
        title: movie.title,
        trailerImageUrl: movie.trailerImageUrl,
        genres: movie.genres,
        rating: movie.rating
      })
    }
    return movies
  }
}