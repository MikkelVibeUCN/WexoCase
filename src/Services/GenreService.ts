
import { Service } from "./Service.ts";

export class GenreService extends Service {
    static async fetchGenres(): Promise<Genre[]> {
        try {
            const response = await this.fetchFromApi(`/genre/movie/list?language=en'`);

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

