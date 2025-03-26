import type { Genre } from "./GenreService"
import { getFullImagePath } from "./ImageService"

export interface Movie {
    id: number
    imageUrl: string
    title: string
    runtime: string
    genres: string[]
    rating: number
}

export function MapToMovie(data: any, genreList: Genre[]): Movie {
    return {
      id: data.id,
      imageUrl: getFullImagePath(data.poster_path),
      title: data.title || data.original_title,
      runtime: 'N/A', 
      genres:
      data.genre_ids?.map((id: number) => {
        const match = genreList.find((g) => g.id === id);
        return match ? match.name : 'Unknown';
      }) || [],
      rating: data.vote_average,
    }
}

export function MapDataToMovies(test: { data: any[], genres: Genre[] }): Movie[] {
    console.log(JSON.stringify(test.genres, null, 2));
    return test.data.map((movie) => MapToMovie(movie, test.genres));
}
  