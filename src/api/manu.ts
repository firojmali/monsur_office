import request from '@/utils/request'

export function getProductswithManu() {
  return request({
    url: '/product/manufacture',
    method: 'get'
  })
}
export function getmanuproductsitems(id: string) {
  return request({
    url: '/manu/product/items/' + id,
    method: 'post'
  })
}

export function insertManuProduct(data: {}) {
  return request({
    url: '/manu/product',
    method: 'post',
    data
  })
}
export function updateManuProduct(uid: string | number, data: {}) {
  return request({
    url: '/manu/update/' + uid,
    method: 'post',
    data
  })
}

export function getToManu() {
  return request({
    url: '/manu/tomanu',
    method: 'post'
  })
}
export function ManuProductComplete(data: any) {
  return request({
    url: '/manu/complete/manufacturing',
    method: 'post',
    data
  })
}
