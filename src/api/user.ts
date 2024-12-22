import request from '@/utils/request'

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
export function login(data: {}) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function testApi() {
  return request({
    url: '/get',
    method: 'get'
  })
}
