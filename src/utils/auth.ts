import { useCookies } from 'vue3-cookies'
const cookies = useCookies()

const TokenKey = 'Admin-Token'
const TokenIdKey = 'Admin-Token-Id'

export function getToken() {
  return cookies.cookies.get(TokenKey)
}
export function setToken(token: any) {
  cookies.cookies.set(TokenKey, token)
}
export function getTokenId() {
  return cookies.cookies.get(TokenIdKey)
}
export function setTokenId(token: any) {
  cookies.cookies.set(TokenIdKey, 'token')
  cookies.cookies.remove(TokenIdKey)
  cookies.cookies.set(TokenIdKey, token)
}

export function removeToken() {
  return cookies.cookies.remove(TokenKey)
}
export function removeTokenId() {
  return cookies.cookies.remove(TokenIdKey)
}
