interface categories {
  id: number //11,
  name: string //"Category name",
  subCategories: subCategories[]
}

interface subCategories {
  name: string //"sub name",
  id: number //12,
  svg_name: string //'name of svg icon',
  product_types: product_types[]
}

interface product_types {
  image: string //"/pr/cat/img.jpg",
  name: string //"product_type:0 > 0 > 0",
  id: number //11,
  mostSoldTenProducts: product[]
}

interface product {
  images: string //"[\"1315.png\", \"1213.png\", \"11.png\" ]",
  name: string //"product Name:1",
  id: number //1,
  thumbnail: string //"a1.png",
  prices: productPrice[]
  sub_catagory: SubCatagoryOBJ
  product_type_id: number
}
///special case//
//**************//
interface categories_c {
  id: number //11,
  name: string //"Category name",
  subCategories: subCategories_c[]
}
interface subCategories_c {
  name: string //"sub name",
  id: number //12,
  svg_name: string //'name of svg icon',
  products: product[]
}
interface productPrice {
  price: number //1000,
  quantity: number //100,
  unit: string //"pcs"
}
interface SubCatagoryOBJ {
  id: number
  name: string
  catagory: Category
}
interface Category {
  id: number
  name: string
}
interface State {
  allCats: categories[]
  std: number
  commonCat: categories_c[]
}
let __x__: State | null = null
let __y__: subCategories_c | null = null
if (__x__) __x__ = null
if (__y__) __y__ = null
