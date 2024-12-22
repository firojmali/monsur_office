import request from '@/utils/request'

export function getProducts(page: string | number) {
  return request({
    url: '/products?page=' + page,
    method: 'get'
  })
}
//getDistricts, setDivisions, setDistricts
