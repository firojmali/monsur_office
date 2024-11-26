import { defineStore } from 'pinia'
import '@/functions/interfeces'
import { getProducts } from '@/api/product'

export const useProductsStore = defineStore('menuItems', {
  state: (): ProductState => ({
    products: [],
    updating: false
  }),
  getters: {},
  actions: {
    getProducts() {
      this.updating = true
      new Promise((resolve, reject) => {
        getProducts(1)
          .then((res: any) => {
            this.products = res.data
            this.updating = false
            resolve(true)
            res
          })
          .catch((err: string) => {
            this.products = []
            this.updating = false
            reject(false)
            err
          })
      })
    },
    Products() {
      return this.products
    }
  },
  persist: {
    key: 'products',
    pick: ['products']
  }
})
