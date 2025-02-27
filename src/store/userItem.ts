import { defineStore } from 'pinia'
import '@/functions/interfeces'
import routes from '@/router/routes'
import { setToken, setTokenId, removeToken, removeTokenId, getTokenId } from '@/utils/auth'

export const useUserItemStore = defineStore('userItem', {
  state: (): UserState => ({
    user: null
  }),
  getters: {
    // is_login(state) {
    //   const pt = parseInt(String(Date.now() / 1000))
    //   console.log(
    //     'store islogin pt vs et',
    //     pt,
    //     state.user?.loginInfo.expireTime,
    //     state.user.loginInfo.expireTime > pt
    //   )
    //   if (state.user?.loginInfo.expireTime && state.user.loginInfo.expireTime > pt) return true
    //   return false
    // },
    getUser(state) {
      const user = { ...state.user }
      user.loginInfo = '__SERVERBONDED_ATOMORK_USER_BOND__'
      user.uid = '__SERVERBONDED_ATOMORK_UUID_BOND__'
      return user
    }
  },
  actions: {
    getToken() {
      return this.user?.token
    },
    getUserName() {
      return this.user ? this.user.name : null
    },
    getTokenId() {
      return this.user?.tokenid
    },
    getUserRoles() {
      const roles: string[] = []
      if (this.user && this.user.user_roles) {
        this.user.user_roles.forEach((user_role) => {
          roles.push(user_role.role)
        })
      }
      return roles
    },
    getuserRoutes() {
      const routeactive: ROUTE[] = []
      if (this.user != null && this.is_login()) {
        const userRoles = this.getUserRoles()
        routes.forEach((route) => {
          if (
            !route.role ||
            !route.role.length ||
            userRoles.find((role: any) => {
              if (role.toLowerCase == 'admin') return true
              if (role && route.role) return route.role.find((routerole) => role == routerole)
              else return false
            })
          )
            routeactive.push(route)
        })
      }
      return routeactive
    },
    logout() {
      const user = {
        id: 0,
        uid: '',
        user_id: this.user?.name,
        name: '',
        token: '',
        tokenid: '',
        loginInfo: null,
        user_roles: null
      }
      this.setAll(user)
      removeToken()
      removeTokenId()
    },
    is_login() {
      const pt = parseInt(String(Date.now() / 1000))
      if (
        this.user?.loginInfo?.expireTime &&
        this.user.loginInfo?.expireTime &&
        this.user.loginInfo.expireTime > pt
      )
        return true
      this.logout()
      return false
    },
    setAll(userData: User) {
      this.user = userData
    },
    setLogin(logindata: any) {
      this.user = logindata
      const user = {
        id: logindata.id,
        uid: '',
        user_id: logindata.name + logindata.id,
        name: logindata.name,
        token: logindata.remember_token,
        tokenid: logindata.updated_at,
        loginInfo: {
          loginTime: parseInt(String(Date.now() / 1000)),
          updateTime: parseInt(String(Date.now() / 1000)),
          expireTime: parseInt(String(Date.now() / 1000)) + 3600,
          isLogIn: true
        },
        user_roles: [{ id: 1, name: 'Admin', role: 'admin', info_id_json: '' }]
      }
      this.setAll(user)
      setToken(logindata.remember_token)
      setTokenId(logindata.updated_at)
      console.log('remembertoken', logindata.remember_token)
      console.log('tokenid', logindata.updated_at, this.getTokenId(), getTokenId())
      //alert('sdfsdfsdaf')
    }
  },
  persist: {
    key: 'useritem_s_ds',
    pick: ['user']
  }
})
