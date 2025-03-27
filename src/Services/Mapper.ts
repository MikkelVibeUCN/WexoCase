import type { Genre } from "./GenreService"
import { getFullImagePath, getFullImagePathWithWidth } from "./ImageService"
import type { MovieShort } from "./MovieService";



export function MapToMovie(data: any, genreList: Genre[]): MovieShort {
    return {
      id: data.id,
      trailerImageUrl: getFullImagePathWithWidth(data.poster_path, 185),
      title: data.title || data.original_title,
      genres:
      data.genre_ids?.map((id: number) => {
        const match = genreList.find((g) => g.id === id);
        return match ? match.name : 'Unknown';
      }) || [],
      rating: Math.round(data.vote_average * 10) / 10,
    }
}

export function MapDataToMovies(data: any[], genres: Genre[]): MovieShort[] {
    console.log(JSON.stringify(genres, null, 2));
    return data.map((movie) => MapToMovie(movie, genres));
}
  