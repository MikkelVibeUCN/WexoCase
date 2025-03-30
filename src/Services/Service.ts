export abstract class Service {
    protected static BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
    protected static API_KEY: string = import.meta.env.VITE_API_KEY;



    protected static headers = {
        'Authorization': `Bearer ${Service.API_KEY}`,
        'Content-Type': 'application/json',
    }

    protected static async fetchFromApi(endpoint: string): Promise<any> {
        return await this.apiCall(endpoint, 'GET', '');
    }

    protected static async postToApi(endpoint: string, content: any) {
        return await this.apiCall(endpoint, 'POST', content)
    }

    protected static async deleteFromApi(endpoint: string, content: any) {
        return await this.apiCall(endpoint, 'DELETE', content)
    }

    private static async apiCall(endpoint: string, type: string, content?: any) {
        const url = `${Service.BASE_URL}${endpoint}`
      
        const options: RequestInit = {
          method: type,
          headers: this.headers,
        }
      
        if (content && type !== 'GET') {
          options.body = typeof content === 'string' ? content : JSON.stringify(content)
        }
      
        const response = await fetch(url, options)
      
        // If the server returned a non-2xx status, throw an error
        if (!response.ok) {
          const err = await response.text()
          throw new Error(`HTTP error ${response.status}: ${err}`)
        }
      
        const data = await response.json()
      
        // If there's a `success` field and it's false, treat as error
        if ('success' in data && data.success === false) {
          throw new Error(`API error on ${type} ${endpoint}`)
        }
      
        return data
      }
      
      
}