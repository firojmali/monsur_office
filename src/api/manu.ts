import request from '@/utils/request'

export function getProductswithManu() {
  return request({
    url: 'product/manufacture',
    method: 'get'
  })
}
export function getProductsWithStockBalance(page: string | number) {
  return request({
    url: '/productswithstock?page=' + page,
    method: 'get'
  })
}

export function insertManuProduct(data: {}) {
  return request({
    url: '/manu/product',
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
