/*
  项目用户关键信息的存取
*/
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY, USER_ID_KEY , APP_ID_KEY } from '@/config/app'

export function getToken () {
  return Cookies.get(APP_TOKEN_KEY)
}

export function setToken (token) {
  return Cookies.set(APP_TOKEN_KEY, token)
}

export function getAppId () {
  return Cookies.get(APP_ID_KEY)
}

export function setAppId (appid) {
  return Cookies.set(APP_ID_KEY, appid)
}


export function removeToken () {
  return Cookies.remove(APP_TOKEN_KEY)
}

export function getUserId () {
  return Cookies.get(USER_ID_KEY)
}

export function setUserId (id) {
  return Cookies.set(USER_ID_KEY, id)
}
