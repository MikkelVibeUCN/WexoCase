import type { Genre } from "./GenreService"
import { getFullImagePathWithWidth } from "./ImageService"
import type { MovieShort } from "./MovieService";


// Remove nulls since it looks terrible with no images
export function MapToMovie(data: any, genreList: Genre[]): MovieShort | null {
  if (!data.poster_path) return null;

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
  };
}


export function MapDataToMovies(data: any[], genres: Genre[]): MovieShort[] {
  return data
    .map((movie) => MapToMovie(movie, genres))
    .filter((mappedMovie): mappedMovie is MovieShort => mappedMovie !== null);
}