import request from '@/utils/request'
import requestbd from '@/utils/requestbd'

export function getDistrictsBD(data: FormData) {
  return requestbd({
    url: '/child.domains.bangla.php',
    method: 'post',
    data
  })
}
export function getDistrictsEN(data: FormData) {
  return requestbd({
    url: '/child.domains.english.php',
    method: 'post',
    data
  })
}

export function setDivisions(data: {}) {
  return request({
    url: '/divisions',
    method: 'post',
    data
  })
}
export function getDivisions() {
  return request({
    url: '/divisions',
    method: 'get'
  })
}
export function getProducts(page: string | number) {
  return request({
    url: '/products?page=' + page,
    method: 'get'
  })
}
//getDistricts, setDivisions, setDistricts
