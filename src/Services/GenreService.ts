import { ServiceClient} from "./ServiceClient.ts";

export class GenreService {
    static async fetchGenres(): Promise<Genre[]> {
        try {
            const response = await ServiceClient.get(`/genre/movie/list?language=en'`);

            return response.genres;
        }
        catch {
            console.error('Failed to get genres');
            return [];
        }
    }
}

export interface Genre {
    id: number;
    name: string;
}