import request from '@/utils/request'

export function getUnits() {
  return request({
    url: '/units',
    method: 'get'
  })
}
