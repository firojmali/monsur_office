import request from '@/utils/request'

export function insertChallan(data: {}) {
  return request({
    url: '/addChallan',
    method: 'post',
    data
  })
}
export function getChallans(page: String) {
  return request({
    url: '/getChallans?page=' + page,
    method: 'get'
  })
}
export function getChallan(challanNumber: String) {
  return request({
    url: '/getChallan/' + challanNumber,
    method: 'get'
  })
}
