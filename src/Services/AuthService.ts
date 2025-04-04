import { ServiceClient } from './ServiceClient'

export class AuthService {
  static async createRequestToken(): Promise<string> {
    const data = await ServiceClient.get(`/authentication/token/new`)

    return data.request_token
  }

  static async createSession(requestToken: string): Promise<string> {
    const response = await ServiceClient.post(`/authentication/session/new`, {
        request_token: requestToken
      })
    return response.session_id
  }

  static async deleteSession(sessionId: string): Promise<void> {
    await ServiceClient.delete(`/authentication/session`, { session_id: sessionId } );
  }
}
