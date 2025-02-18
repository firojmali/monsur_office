<script setup lang="ts">
import '@/functions/interfeces'
import { login, testApi } from '@/api/user'
import { useMenuItemsStore } from './store/menuItems'
import { useUserItemStore } from './store/userItem'
// import { useProductsStore } from './store/product'
import serverdata from './sedoserver/serveritems'
</script>

<template>
  <body :class="{ bgloadding: loadding }" class="w-full">
    <el-button v-if="is_loged_in" @click="logout" type="primary" class="m-2">Logout</el-button>
    <div class="loadding" v-if="loadding || logoutloadding">
      <div class="loader"></div>
      loadding
    </div>
    <div v-else-if="!is_loged_in">
      <div class="login-body shadow-otto">
        <h3 style="text-align: center">Login</h3>
        <div class="useridbody">
          <span>Your User ID:</span><span><input type="text" v-model="loginfeilds.user_id" /></span>
        </div>
        <div class="passwordbody">
          <span>Your Password:</span
          ><span><input type="password" v-model="loginfeilds.password" /></span>
        </div>
        <button class="button-add-cart w-full text-center" role="button" @click="userLogin">
          Log In
        </button>
      </div>
    </div>
    <div v-else class="w-full p-4">
      <div class="w-full h-12 fixed">
        <el-menu
          ellipsis
          :default-active="getrouternameindex()"
          class="el-menu-popper-demo"
          mode="horizontal"
          :popper-offset="16"
          style="max-width: 600px"
        >
          <templete v-for="menuItem in menu" :key="menuItem.menu_index">
            <el-menu-item
              v-if="menuItem.sub.length < 1"
              :index="menuItem.menu_index"
              @click="gotoroute(menuItem.router_to)"
              >{{ menuItem.label }}</el-menu-item
            >
            <el-sub-menu v-else :index="menuItem.menu_index">
              <template #title>{{ menuItem.label }}</template>
              <el-menu-item
                v-for="menuItems in menuItem.sub"
                :key="menuItems.menu_index"
                :index="menuItem.menu_index + '-' + menuItems.menu_index"
                @click="gotoroute(menuItems.router_to)"
                >{{ menuItems.label }}</el-menu-item
              >
            </el-sub-menu>
          </templete>
          <!-- <el-menu-item
            v-for="menuItem in menu"
            :key="menuItem.menu_index"
            :index="menuItem.menu_index"
            ><RouterLink :to="menuItem.router_to">{{ menuItem.label }}</RouterLink></el-menu-item
          > -->
          <!-- <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>item four</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="3" :popper-offset="8">
            <template #title>Override Popper Offset</template>
            <el-menu-item index="3-1">item one</el-menu-item>
            <el-menu-item index="3-2">item two</el-menu-item>
            <el-menu-item index="3-3">item three</el-menu-item>
            <el-sub-menu index="3-4" :popper-offset="20">
              <template #title>override child</template>
              <el-menu-item index="3-4-1">item one</el-menu-item>
              <el-menu-item index="3-4-2">item two</el-menu-item>
              <el-menu-item index="3-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="4" disabled>Info</el-menu-item>
          <el-menu-item index="5">Orders</el-menu-item> -->
        </el-menu>
      </div>
      <div class="h-12 w-full"></div>
      <div class="w-full h-full shadow-md router-container m-4">
        <RouterView />
      </div>
    </div>
  </body>
</template>
<script lang="ts">
export default {
  data() {
    const user: any = {}
    return {
      activework: false,
      loadding: true,
      menustore: useMenuItemsStore(),
      userState: useUserItemStore(),
      is_loged_in: false,
      logoutloadding: false,
      user,
      menu: [
        { label: 'Product', router_name: 'home', menu_index: '1', router_to: '/', sub: [] },
        {
          label: 'Challan',
          router_name: 'challan',
          menu_index: '1',
          router_to: '/challan',
          sub: []
        },
        {
          label: 'Stock',
          router_name: '',
          menu_index: '2',
          router_to: '',
          sub: [
            {
              label: 'Balance',
              router_name: 'stock',
              menu_index: '1',
              router_to: '/stock',
              sub: []
            },
            {
              label: 'Closing',
              router_name: 'stock_closing',
              menu_index: '2',
              router_to: '/stock/closing',
              sub: []
            },
            {
              label: 'Set Starting Balance',
              router_name: 'stock_start',
              menu_index: '3',
              router_to: '/stock/onetime/start',
              sub: []
            }
          ]
        },
        {
          label: 'Manufacture',
          router_name: '',
          menu_index: '3',
          router_to: '',
          sub: [
            {
              label: 'Products',
              router_name: 'Manufacture Product',
              menu_index: '1',
              router_to: '/manu/products',
              sub: []
            },
            {
              label: 'Manufacture Now',
              router_name: 'Manufacture',
              menu_index: '2',
              router_to: '/manu/manufacture',
              sub: []
            }
          ]
        }
      ],
      user1: {
        id: 0,
        uid: '',
        user_id: 0,
        name: '',
        loginInfo: null
      },
      loginuserid: 0,
      loginpassword: 0,
      loginfeilds: {
        user_id: '',
        password: ''
      }
    }
  },
  created() {
    //this.testserver()
    var presentdt = parseInt(String(Date.now() / 1000))
    this.checkLogIn()
    this.getcommondatas(presentdt)
  },
  watch: {
    is_loged_in(newV, oldV) {
      if (newV != oldV && newV) {
        //this.checkLogIn()
      }
    }
  },
  methods: {
    testserver() {
      return new Promise((resolve, reject) => {
        testApi()
          .then((res: any) => {
            console.log('api result:', res)
          })
          .catch((err: string) => {
            reject(false)
            console.log('api result Error:', err)
            err
          })
      })
    },
    gotoroute(to: string) {
      this.$router.push(to)
    },
    getrouternameindex() {
      const prn = this.$route.name
      const indx = this.getforeachmenuindex(prn, this.menu)
      console.log(indx)
      return indx
    },
    getforeachmenuindex(prn: any, menu: any, preindex: any = '') {
      let index = '0'
      menu.forEach((menuitem: any) => {
        if (menuitem.sub.length > 0) {
          if (index == '0')
            index = this.getforeachmenuindex(
              prn,
              menuitem.sub,
              preindex + menuitem.menu_index + '-'
            )
        } else {
          if (prn == menuitem.router_name) {
            index = preindex + menuitem.menu_index
          }
        }
      })
      return index
    },
    userLogin() {
      this.activework = true
      new Promise((resolve, reject) => {
        login({ name: this.loginfeilds.user_id, password: this.loginfeilds.password })
          .then((res: any) => {
            this.activework = false
            alert('sdfasdf')
            if (res.code == 20000) {
              //log in success
              const userstore = useUserItemStore()
              userstore.setLogin(res.data)
              this.checkLogIn()
            } else {
              //login not success
              this.loginfeilds.user_id = ''
              this.loginfeilds.password = ''
            }
            location.reload()
            resolve(true)
          })
          .catch((err: string) => {
            this.activework = false
            console.log(err)
            reject(false)
          })
      })
    },
    logout() {
      this.loadding = true
      const userstore = useUserItemStore()
      userstore.logout()
      this.logoutloadding = true
    },
    // UserLogin() {
    //   //var userlogin = serverdata.methods.userLogin(this.loginfeilds)
    //   if (userlogin && userlogin.loginInfo.isLogIn) {
    //     const userstore = useUserItemStore()
    //     userstore.setAll(userlogin)
    //     this.checkLogIn()
    //     console.log('User login', this.is_loged_in, userlogin)
    //   }
    // },
    checkLogIn() {
      const userstore = useUserItemStore()
      if (userstore.user != null) {
        this.user = userstore.getUser
      }
      if (userstore.user != null && userstore.is_login()) {
        this.is_loged_in = true
        //console.log(userstore.getuserRoutes())
        setTimeout(this.checkLogIn, 5000)
      } else {
        this.loginfeilds.user_id = this.user.user_id
        this.loginfeilds.password = ''
        this.loadding = false
        this.is_loged_in = false
      }
      this.logoutloadding = false
      //console.log('Check Login', this.is_loged_in)
    },
    getcommondatas(presentdt: number) {
      presentdt = presentdt - 5 * 60 //next data update interval
      const menustore = useMenuItemsStore()
      if (
        menustore.allCats.length > 0 &&
        menustore.std &&
        parseInt(String(menustore.std)) > presentdt
      ) {
        //console.log('previous value')
      } else {
        console.log('new stor created')
        menustore.setAll(serverdata.methods.createDummyData())
        menustore.std = parseInt(String(Date.now() / 1000))
      }
      //console.log(menustore.allCats)
      this.loadding = false
    }
  }
}
</script>
<style lang="css" scoped>
.router-container {
  width: calc(100% - 8px);
  box-shadow:
    inset 17px 18px 20px 20px #90ddb980,
    -1px 2px 0px 0px #6127d3db,
    12px 12px 15px 3px;
}
.login-body {
  max-width: 100%;
  width: fit-content;
  margin: auto;
  margin-top: 80px;
}
.loadding {
  color: #000834;
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* HTML: <div class="loader"></div> */
.loader {
  margin-left: 13px;
  width: 40px;
  aspect-ratio: 1;
  --c: no-repeat linear-gradient(#000 0 0);
  background:
    var(--c) 0 0,
    var(--c) 0 100%,
    var(--c) 50% 0,
    var(--c) 50% 100%,
    var(--c) 100% 0,
    var(--c) 100% 100%;
  background-size: 8px 50%;
  animation: l7-0 1s infinite;
  position: relative;
  overflow: hidden;
}
.loader:before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #000;
  top: calc(50% - 4px);
  left: -8px;
  animation: inherit;
  animation-name: l7-1;
}

@keyframes l7-0 {
  16.67% {
    background-size:
      8px 30%,
      8px 30%,
      8px 50%,
      8px 50%,
      8px 50%,
      8px 50%;
  }
  33.33% {
    background-size:
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 50%,
      8px 50%;
  }
  50% {
    background-size:
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%;
  }
  66.67% {
    background-size:
      8px 50%,
      8px 50%,
      8px 30%,
      8px 30%,
      8px 30%,
      8px 30%;
  }
  83.33% {
    background-size:
      8px 50%,
      8px 50%,
      8px 50%,
      8px 50%,
      8px 30%,
      8px 30%;
  }
}

@keyframes l7-1 {
  20% {
    left: 0px;
  }
  40% {
    left: calc(50% - 4px);
  }
  60% {
    left: calc(100% - 8px);
  }
  80%,
  100% {
    left: 100%;
  }
}
</style>
