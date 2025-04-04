// Client for handling any requests to the API, other services uses this
// 
// Environment variables, edit/create file rootfolder/env with format:
// VITE_API_BASE_URL=https://api.themoviedb.org/3
// VITE_API_KEY=TOKEN
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}

function formatBody(content: unknown): string | undefined {
  if (content === null || content === undefined) return undefined
  return typeof content === 'string' ? content : JSON.stringify(content)
}

async function request<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE',
  content?: any
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  const options: RequestInit = {
    method,
    headers,
    body: formatBody(content),
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HTTP ${response.status}: ${error}`)
  }

  const data = await response.json()

  if ('success' in data && data.success === false) {
    throw new Error(`API failure: ${method} ${endpoint}`)
  }

  return data
}

// CRD (update not needed currently, can always easily be added)
export const ServiceClient = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, 'GET'),
  post: <T = any>(endpoint: string, content: any) => request<T>(endpoint, 'POST', content),
  delete: <T = any>(endpoint: string, content: any) => request<T>(endpoint, 'DELETE', content),
}