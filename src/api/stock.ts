import request from '@/utils/request'

export function insertOpeningStock(data: {}) {
  return request({
    url: '/setopening',
    method: 'post',
    data
  })
}
export function updateProduct(uid: string | number, data: {}) {
  return request({
    url: '/product/' + uid,
    method: 'post',
    data
  })
}
export function stockChallans(data: {}) {
  return request({
    url: '/stock/product/challan/history',
    method: 'post',
    data
  })
}
