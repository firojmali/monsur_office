const type = 1 //1=server     0=local

import axios from 'axios'
import { ElMessage } from 'element-plus' //ElMessageBox,
import { getToken, getTokenId } from '@/utils/auth'

//import store from '@/store'
//import { getToken } from '@/utils/auth'

const token = getToken()
const tokenid = getTokenId()
const base_local = 'https://www.bangladesh.gov.bd'
const base_remote = 'https://www.bangladesh.gov.bd'
let base_active = base_local
if (type) {
  base_active = base_remote
}
// create an axios instance
const service = axios.create({
  baseURL: base_active, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    // if (store.getters.token) {

    //   config.headers['X-Token'] = getToken()
    // }
    //config.headers['token'] = token
    //config.headers['tokenid'] = tokenid
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  (response) => {
    const res = response.data

    return res
  },
  (error) => {
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service