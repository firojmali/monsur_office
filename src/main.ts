import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
//import { useUserItemStore } from '@/store/userItem'

import { globalCookiesConfig } from 'vue3-cookies'

globalCookiesConfig({
  expireTimes: '2d',
  path: '/',
  domain: '',
  secure: true,
  sameSite: 'None'
})

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

//const userstore = useUserItemStore()
app.use(router)
app.use(ElementPlus)
app.mount('#app')
