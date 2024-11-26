import { defineStore } from 'pinia'
import '@/functions/interfeces'
import { getAllProducts } from '@/api/product'

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
        getAllProducts()
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
