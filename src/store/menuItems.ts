import { defineStore } from 'pinia'
import '@/functions/interfeces'

export const useMenuItemsStore = defineStore('menuItems', {
  state: (): State => ({
    allCats: [],
    std: 0,
    commonCat: []
  }),
  getters: {
    getCategoryById(state) {
      return (id: number) => state.allCats.find((cat) => cat.id === id)
    },
    getSubCategoryById(state) {
      return (id: number) =>
        state.allCats.find((cat) => cat.subCategories.find((subcat) => (subcat.id = id)))
    },
    getProductTypeById(state) {
      return (id: number) =>
        state.allCats.find((cat) =>
          cat.subCategories.find((subcat) => subcat.product_types.find((pt) => (pt.id = id)))
        )
    },
    getAllCategories(state) {
      return state.allCats
    }
  },
  actions: {
    setAll(data: categories[]) {
      this.allCats = data
    }
  },
  persist: {
    key: 'menuitem_s_ds',
    pick: ['allCats', 'std']
  }
})
