import '@/functions/interfeces'
import HomeView from '../views/HomeView.vue'
import StockView from '../views/stock/StockPage.vue'
const routes: ROUTE[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    role: ['store']
  },
  {
    path: '/stock',
    name: 'stock',
    component: StockView,
    role: ['store']
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    role: []
  }
]
export default routes
