import { defineStore } from 'pinia'

interface State {
  allCats: categories[]
  sedothumbs: SedoThumbs[]
}

export const SedoProducts = defineStore('useProducts', {
  state: (): State => ({
    allCats: [],
    sedothumbs: []
  }),
  getters: {
    getCategoryById(state) {
      return (id: number) => state.allCats.find((cat) => cat.category_id === id)
    },
    getSubCategoryById(state) {
      return (id: number) =>
        state.allCats.find((cat) =>
          cat.subCategories.find((subcat) => (subcat.sub_catagory_id = id))
        )
    },
    getProductTypeById(state) {
      return (id: number) =>
        state.allCats.find((cat) =>
          cat.subCategories.find((subcat) =>
            subcat.product_types.find((pt) => (pt.product_type_id = id))
          )
        )
    },
    getAllCategories(state) {
      return state.allCats
    }
  },
  actions: {
    setAll(data: categories) {
      this.allCats = data
    }
  },
  persist: {
    key: 'menuitem_s_ds',
    pick: ['allCats', 'std']
  }
})

interface categories {
  category_id: number //11,
  name: string //"Category name",
  subCategories: subCategories[]
}
interface subCategories {
  name: string //"sub name",
  sub_catagory_id: number //12,
  svg_name: string //'name of svg icon',
  product_types: product_types[]
}
interface product_types {
  image: string //"/pr/cat/img.jpg",
  name: string //"product_type:0 > 0 > 0",
  product_type_id: number //11,
  mostSoldTenProducts: mostSoldTenProducts[]
}
interface products {
  images: string //"[\"1315.png\", \"1213.png\", \"11.png\" ]",
  name: string //"product Name:1",
  product_id: number //1,
  thumbnail: string //"a1.png",
  prices: prices[]
}
interface prices {
  price: number //1000,
  quantity: number //100,
  unit: string //"pcs"
}
interface SedoThumbs {
  price: String //"https://sadfsadf.sdaf.s/sdf.jpg"
}
