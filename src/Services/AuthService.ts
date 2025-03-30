import { Service } from './Service'

export class AuthService extends Service {
  static async createRequestToken(): Promise<string> {
    const data = await this.fetchFromApi(`/authentication/token/new`)

    return data.request_token
  }

  static async createSession(requestToken: string): Promise<string> {
    const response = await this.postToApi(`/authentication/session/new`, {
        request_token: requestToken
      })
    return response.session_id
  }

  static async deleteSession(sessionId: string): Promise<void> {
    await Service.deleteFromApi(`/authentication/session`, { session_id: sessionId } );
  }
}
