
import { Service } from "./Service.ts";


export class GenreService extends Service {
    static async fetchGenres(): Promise<Genre[]> {
        try {
            const response = await fetch(`${Service.BASE_URL}/genre/movie/list`, {
                headers: {
                    'Authorization': `Bearer ${Service.API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return data.genres;
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

