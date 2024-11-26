import request from '@/utils/request'

export function getProducts(page: string | number) {
  return request({
    url: '/products?page=' + page,
    method: 'get'
  })
}
export function getProductsWithStockBalance(page: string | number) {
  return request({
    url: '/products?page=' + page,
    method: 'get'
  })
}

export function insertProduct(data: {}) {
  return request({
    url: '/product',
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
