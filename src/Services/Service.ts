export abstract class Service {
    protected static BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
    protected static API_KEY: string = import.meta.env.VITE_API_KEY;    

    protected static headers = {
        'Authorization': `Bearer ${Service.API_KEY}`,
        'Content-Type': 'application/json'
    }
}