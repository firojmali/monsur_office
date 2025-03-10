const type = 0 //1=server     0=local

import axios from 'axios'
import { ElMessage } from 'element-plus' //ElMessageBox,
import { getToken, getTokenId } from '@/utils/auth'

//import store from '@/store'
//import { getToken } from '@/utils/auth'

const token = getToken()
const tokenid = getTokenId()
console.log('token id', tokenid)
const base_local = 'http://127.0.0.1:8000/api'
const base_remote = 'http://at.mmtgroupbd.com/public/api'
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
    config.headers['token'] = token
    config.headers['tokenid'] = tokenid
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
    //console.log(response)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        /*
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })*/
        ElMessage({
          message: 'Please Logout and Login Again',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
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
