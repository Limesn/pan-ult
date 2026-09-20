import { defineStore } from 'pinia'

export interface UserInfo {
  id: number
  open_id: string
  name: string
  avatar_url: string
  created_at: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: localStorage.getItem('pan_ult_token') || ''
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('pan_ult_token', token)
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('pan_ult_token')
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    logout() {
      this.clearToken()
      this.userInfo = null
    }
  }
})
