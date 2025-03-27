export abstract class Service {
    protected static BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
    protected static API_KEY: string = import.meta.env.VITE_API_KEY;    



    protected static headers = {
        'Authorization': `Bearer ${Service.API_KEY}`,
        'Content-Type': 'application/json',
    }

    protected static async fetchFromApi(endpoint: string): Promise<any> {
        const url = `${Service.BASE_URL}${endpoint}`;
        const response = await fetch(url, {
          method: "GET",
          headers: Service.headers,
        });
        if (!response.ok) throw new Error(`API call failed: ${url}`);
            return response.json();
    }
}