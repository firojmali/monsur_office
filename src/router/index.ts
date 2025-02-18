import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StockView from '../views/stock/StockPage.vue'
import StockStart from '../views/stock/StockStart.vue'
import TransferView from '@/views/chalan/Transfer.vue'
import ManuManu from '@/views/manufacture/ManuManu.vue'
import ManuProducts from '@/views/manufacture/ManuProducts.vue'
// import rolechecker from '@/router/rolecheker'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/stock',
      name: 'stock',
      component: StockView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/challan',
      name: 'challan',
      component: TransferView
    },
    {
      path: '/stock/onetime/start',
      name: 'stock_start',
      component: StockStart
    },
    {
      path: '/view/stockledger/:id',
      name: 'StockLedgerView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StockLedgerView.vue')
    },
    {
      path: '/manu/manufacture',
      name: 'Manufacture',
      component: ManuManu
    },
    {
      path: '/manu/products',
      name: 'Manufacture Product',
      component: ManuProducts
    }
  ]
})

export default router
