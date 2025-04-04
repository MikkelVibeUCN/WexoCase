import { ref } from 'vue'
import { ServiceClient } from './ServiceClient'
import { AuthService } from './AuthService'
import { CookieService } from './CookieService'
import { MovieService } from './MovieService'

export interface AccountDetails {
  id: number
  name: string
  username: string
  avatarUrl: string
}

const _user = ref<AccountDetails | null>(null)
const _isInitialized = ref(false)
let _initPromise: Promise<void> | null = null

export class AccountService {
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
    if (_initPromise) return _initPromise

    _initPromise = (async () => {
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

        if (_user.value) {
          await MovieService.loadFavoriteMoviesIfNeeded()
        }

      } catch (err) {
        console.error('Error initializing session:', err)
        this.logout()
      } finally {
        _isInitialized.value = true
        _initPromise = null
      }
    })()

    return _initPromise
  }

  static logout(): void {
    // Delete session if theres a session id in cookie
    if(this.sessionId) {
      AuthService.deleteSession(this.sessionId as string)
    }
    CookieService.remove('session_id')

    _user.value = null
    _isInitialized.value = false

    MovieService.clearFavoriteCache?.()
  }

  static async getDetails(sessionId: string): Promise<AccountDetails> {
    const endpoint = `/account?session_id=${sessionId}`
    const data = await ServiceClient.get(endpoint)

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      avatarUrl: data.avatar?.tmdb?.avatar_path
        ? `https://image.tmdb.org/t/p/w185${data.avatar.tmdb.avatar_path}`
        : '/UserIcon.svg'
    }
  }

  static async addMovieToFavorites(accountId: number, sessionId: string, movieId: number, isFavorite: boolean): Promise<void> {
    const url = `/account/${accountId}/favorite?session_id=${sessionId}`
    const body = {
      media_type: 'movie',
      media_id: movieId,
      favorite: isFavorite,
    }
    await ServiceClient.post(url, body)
  }

  static async isMovieFavorited(movieId: number): Promise<boolean> {
    try {
      await MovieService.loadFavoriteMoviesIfNeeded()
      return MovieService.isMovieInFavorites(movieId)
    } catch (err) {
      return false
    }
  }
}