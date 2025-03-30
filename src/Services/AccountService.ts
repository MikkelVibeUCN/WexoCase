import { ref } from 'vue'
import { Service } from './Service'
import { AuthService } from './AuthService'
import { CookieService } from './CookieService'

export interface AccountDetails {
  id: number
  name: string
  username: string
  avatarUrl: string
}

const _user = ref<AccountDetails | null>(null)
const _isInitialized = ref(false)

export class AccountService extends Service {
  static get user() {
    return _user.value
  }

  static get isLoggedIn() {
    return !!_user.value
  }

  static get sessionId(): string | undefined {
    return CookieService.get('session_id')
  }

  static async initializeSession(): Promise<void> {
    if (_isInitialized.value) return

    const params = new URLSearchParams(window.location.search)
    const requestToken = params.get('request_token')
    const sessionId = CookieService.get('session_id')

    try {
      if (sessionId) {
        _user.value = await this.getDetails(sessionId)
      } else if (requestToken) {
        const newSession = await AuthService.createSession(requestToken)
        CookieService.set('session_id', newSession, 7)
        _user.value = await this.getDetails(newSession)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } catch (err) {
      console.warn('Failed to initialize session', err)
      this.logout()
    } finally {
      _isInitialized.value = true
    }
  }

  static logout(): void {
    CookieService.remove('session_id')
    _user.value = null
    _isInitialized.value = false
  }

  static async getDetails(sessionId: string): Promise<AccountDetails> {
    const endpoint = `/account?session_id=${sessionId}`
    const data = await this.fetchFromApi(endpoint)

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      avatarUrl: data.avatar?.tmdb?.avatar_path
        ? `https://image.tmdb.org/t/p/w185${data.avatar.tmdb.avatar_path}`
        : '/UserIcon.svg'
    }
  }

  static async addMovieToFavorites(accountId: number, sessionId: string, movieId: number, favorite: boolean): Promise<void> {
    const url = `/account/${accountId}/favorite?session_id=${sessionId}`
    const body = {
      media_type: 'movie',
      media_id: movieId,
      favorite,
    }
    await this.postToApi(url, body)
  }
}
