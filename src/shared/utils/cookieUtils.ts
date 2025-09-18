import Cookies from 'js-cookie'

export function getCookie(name: string) {
  return Cookies.get(name)
}

export function setCookie(name: string, value: string, options: Cookies.CookieAttributes) {
  Cookies.set(name, value, options)
}

export function removeCookie(name: string) {
  Cookies.remove(name)
}
