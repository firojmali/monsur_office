interface ProductsResponse {
  code: number
  data: ProductsPaginate
}
interface ProductState {
  products: Product[]
  updating: boolean
}
interface ProductsPaginate {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
  data: Product[]
}
interface Products {
  data: Product[]
}
interface Product {
  id: number
  created_at: number
  updated_at: number
  uid: string
  type: string
  name: string
  description: string
  unit_uid: string
  is_complete: boolean
  is_saleable: boolean
  entry_by: string
  changes: string
  unit: Unit
}
interface Unit {
  id: number
  created_at: number
  updated_at: number
  entry_by: string
  history: string
  uid: string
  unit: string
  remarks: string
}

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
interface UserState {
  user: User | null
}
interface User {
  id: number
  user_id: number | string | undefined
  uid: string
  name: string
  tokenid: any
  token: any
  loginInfo: any
  user_roles: UserRole[] | null
}
interface UserRole {
  id: number
  role: string
  name: string
  info_id_json: string | null
}
interface LoginInfo {
  loginTime: number
  updateTime: number
  expireTime: number
  isLogIn: boolean
}
interface ROUTE {
  path: string
  name: string
  role: string[]
  component: string | {}
}
let __x__: State | null = null
let __u__: UserState | null = null
let __y__: subCategories_c | null = null
if (__x__) __x__ = null
if (__y__) __y__ = null
if (__u__) __u__ = null
let __z__: ROUTE | null = null
if (__z__) __z__ = null
let __z1__: ProductsResponse | null = null
if (__z1__) __z1__ = null
let __z2__: Products | null = null
if (__z2__) __z2__ = null
let __z3__: LoginInfo | null = null
if (__z3__) __z3__ = null
let __z4__: ProductState | null = null
if (__z4__) __z4__ = null
