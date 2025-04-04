import Cookies from 'js-cookie'

export class CookieService {
  static get(name: string): string | undefined {
    return Cookies.get(name)
  }

  static set(name: string, value: string, days = 7) {
    Cookies.set(name, value, {
      expires: days,
      secure: true,
      sameSite: 'Strict',
    })
  }

  static remove(name: string) {
    Cookies.remove(name)
  }

  static has(name: string): boolean {
    return !!Cookies.get(name)
  }
}