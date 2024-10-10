<script setup lang="ts">
import ButtonView from '@/components/Common/ButtonView.vue'
import router from '@/router'
import { useMenuItemsStore } from '@/store/menuItems'
</script>
<template>
  <div class="topbar">
    <div class="upperline">
      <!--upper Line-->
      <div style="height: 100%">
        <!--Logo-->
        <div class="logo centerdiv cursor-pointer" @click="gotoHome()"></div>
      </div>
      <!--searchbar-->
      <div class="searchbar">
        <input value="" class="input" />
        <ButtonView color="var(--color-search)" class="button">
          <template #post> .. </template>
          Search
        </ButtonView>
      </div>
      <div>
        <div
          class="user-logo"
          :class="{ 'user-logedin': user.logedIn, 'user-notlogedin': !user.logedIn }"
        ></div>
      </div>
      <div>
        <div class="transparent-button">
          <ButtonView
            color="var(--color-fulltransparent)"
            class="transparent-button but-on-underline"
            >{{ user.logedIn ? 'Log Out' : 'Log In' }}</ButtonView
          >
        </div>
        <div class="transparent-button">
          <ButtonView
            color="var(--color-fulltransparent)"
            class="transparent-button but-on-underline"
            >{{ user.logedIn ? 'Profile' : 'Register' }}</ButtonView
          >
        </div>
      </div>
      <div style="padding-left: 5px">
        <div
          class="user-logo"
          :class="{ 'cart-fill': user.cart > 0, 'cart-empty': user.cart <= 0 }"
        ></div>
      </div>
    </div>
    <div class="bottomline">
      <div style="height: 100%; width: 40px">
        <!--menu Logo-->
        <div class="menulogo cursor-pointer pt-5" @click="gotoHome()">HOME</div>
      </div>
      <div style="padding-top: 5px; padding-left: 10px">
        <ButtonView
          color="var(--color-fulltransparent)"
          class="transparent-button but-on-underline ml10"
          @mouseover="catHidden = false"
          @mouseleave="catHidden = true"
          >Categories
          <div class="menu-panel" :class="{ visible: !catHidden, 'not-visible': catHidden }">
            <div class="one3 pl10 bl y-scrool">
              <ul class="no-bullets">
                <li
                  v-for="category in categories"
                  :key="category.id"
                  class="catclass"
                  :class="{
                    'background-selected': category.id == catMenuData.selectedCatId
                  }"
                >
                  <ButtonView
                    color="var(--color-fulltransparent)"
                    class="transparent-button"
                    style="width: 100%; font-size: 17px"
                    @mouseover="getsubcat(category.id)"
                  >
                    {{ category.name }}</ButtonView
                  >
                </li>
              </ul>
            </div>
            <div class="one3 pl10 bl y-scrool">
              <ul class="no-bullets">
                <li
                  v-for="subcategory in subcat"
                  :key="subcategory.id"
                  class="catclass"
                  :class="{
                    'background-selected': subcategory.id == catMenuData.selectedSubId
                  }"
                >
                  <ButtonView
                    color="var(--color-fulltransparent)"
                    class="transparent-button but-on-underline"
                    style="width: 100%; font-size: 16px"
                    @mouseover="getprod(subcategory.id)"
                    @click="ShowSubCategoryproduct_types(subcategory.id)"
                  >
                    <img
                      :src="getbgimg(subcategory.svg_name)"
                      style="height: 14px; margin-right: 15px"
                    />
                    {{ subcategory.name }}</ButtonView
                  >
                </li>
              </ul>
            </div>
            <div class="one3 pl10 bl">
              <ButtonView
                color="var(--color-fulltransparent)"
                class="transparent-button but-on-underline"
                style="width: 100%; font-size: 16px; margin-bottom: 10px"
                @click="ShowSubCategoryproduct_types(catMenuData.selectedSubId)"
              >
                <u>{{ catMenuData.selectedSubName }}</u></ButtonView
              >
              <div class="product-group product-type-group">
                <div
                  v-for="item in prod"
                  :key="item.id"
                  class="each-product each-product-type"
                  :class="{
                    'background-selected': item.id === catMenuData.mouseOverproduct_typeId
                  }"
                >
                  <ButtonView
                    color="var(--color-fulltransparent)"
                    class="transparent-button"
                    style="width: 100%; font-size: 15px"
                    @mouseover="catMenuData.mouseOverproduct_typeId = item.id"
                    @mouseleave="catMenuData.mouseOverproduct_typeId = 0"
                    @click="Showproduct_type(item.id)"
                  >
                    <img src="http://google.com/a.jpg" class="product-type-img" />
                    {{ item.name }}
                  </ButtonView>
                </div>
              </div>
            </div>
          </div>
        </ButtonView>
        <ButtonView
          color="var(--color-fulltransparent)"
          class="transparent-button but-on-underline ml10"
          @mouseover="newCatHidden = false"
          @mouseleave="newCatHidden = true"
          >New Arival
          <div class="menu-panel" :class="{ visible: !newCatHidden, 'not-visible': newCatHidden }">
            List of new product_types
          </div>
        </ButtonView>
        <ButtonView
          color="var(--color-fulltransparent)"
          class="transparent-button but-on-underline ml10"
          @mouseover="tradeHidden = false"
          @mouseleave="tradeHidden = true"
          >Trade Assurance
          <div class="menu-panel" :class="{ visible: !tradeHidden, 'not-visible': tradeHidden }">
            Trade Assurance lists
          </div>
        </ButtonView>
      </div>
      <div style="padding-top: 5px; padding-left: 10px; position: absolute; right: 10px">
        <ButtonView
          color="var(--color-fulltransparent)"
          class="transparent-button but-on-underline ml10"
          >Delivery Tracker</ButtonView
        >
        <ButtonView
          color="var(--color-fulltransparent)"
          class="transparent-button but-on-underline ml10"
          >Help Center</ButtonView
        >
        <ButtonView
          color="var(--color-fulltransparent)"
          class="transparent-button but-on-underline ml10"
          >Become A Supplier</ButtonView
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      menustore: useMenuItemsStore(),
      user: {
        logedIn: false,
        type: '',
        cart: 0
      },
      catHidden: true,
      newCatHidden: true,
      tradeHidden: true,
      categories: [],
      subcat: [],
      prod: [],
      catMenuData: {
        selectedCatId: 0,
        selectedSubId: 0,
        mouseOverproduct_typeId: 0,
        selectedSubName: ''
      },
      newitems: [],
      trade: []
    }
  },
  created() {
    //console.log('in created')
    this.getdata()
    // this.menustore = useMenuItemsStore()
    //console.log('end created', this.categories)
  },
  methods: {
    getbgimg(svgName) {
      return 'src/assets/' + svgName + '.svg'
    },
    getdata() {
      //Data structure:
      /* 
        this.categories=[{
          id: 11,
          name: "Category name",
          subCategories:[{
            name:"sub name",
            id:12,
            svg_name:'name of svg icon',
            product_types:[{
              image: "/pr/cat/img.jpg",
              name: "product_type:0 > 0 > 0",
              id:11,
              mostSoldTenProducts:[
                {
                  images: "[\"1315.png\", \"1213.png\", \"11.png\" ]",
                  name: "product Name:1",
                  product_id: 1,
                  thumbnail: "a1.png",
                  prices:[{price: "1000", quantity: 100, unit: "pcs"}]
                }....10 items
              ]
            }]
          }]
        }]
        */
      this.categories = [...this.menustore.allCats]
      //console.log(serverdata.methodes.createDummyData())
      this.getsubcat(this.categories[0].id)
    },
    getsubcat(cat_id) {
      this.catMenuData.selectedCatId = cat_id
      var h1 = []
      h1 = this.categories.filter((cat) => cat.id === cat_id)
      if (typeof h1[0] != 'undefined') {
        this.subcat = h1[0].subCategories
      }
      //console.log('sub categories', this.subcat)
      this.getprod(this.subcat[0].id)
    },
    getprod(sub_id) {
      this.prod = []
      this.catMenuData.selectedSubId = sub_id
      var h1 = this.subcat.filter((subcat) => subcat.id === sub_id)
      if (typeof h1[0] != 'undefined') {
        this.catMenuData.selectedSubName = h1[0].name
        this.prod = h1[0].product_types
      } else {
        this.catMenuData.selectedSubName = ''
      }
      //console.log('product_types', this.prod)
    },
    ShowSubCategoryproduct_types(subid) {
      this.catHidden = true
      this.$emit('update', { menuname: 'subcategory', args: { id: subid } })
      this.$router.push({ name: 'CatagoryView', params: { id: subid } })
    },
    Showproduct_type(pid) {
      this.catHidden = true
      //console.log('emit to show  product_types of id = ', pid)
      this.$emit('update', { menuname: 'producttype', args: { id: pid } })
      //this.$router.push({ name: 'about' })
      this.$router.push({ name: 'showmultiproduct', params: { id: pid } })
    },
    gotoHome() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
<style scoped>
.centerdiv {
  position: relative;
  top: 50%;
  margin-top: 10px;
}
.logo {
  width: 180px;
  height: 30px;
  background-image: url('/src/assets/logo_atw.svg');
  background-repeat: no-repeat;
  background-size: cover;
}
.menulogo {
  width: 40px;
  height: 30px;
  background-image: url('@/assets/menu.svg');
  background-repeat: no-repeat;
  background-size: cover;
}
.topbar {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 90px;
  margin: 0;
  padding: 5px 5px 10px 5px;
  background-color: aliceblue;
}
.upperline {
  width: 100%;
  display: flex;
}
.bottomline {
  width: 100%;
  display: flex;
}
.ml10 {
  margin-left: 10px;
}
.searchbar {
  height: var(--width-search);
  margin: auto;
  border: 2px solid var(--color-search);
  border-radius: 12px;
  padding: 0px 8px 0px 8px;
  min-width: 50%;
}
.searchbar .input {
  border: none;
  background-color: #ffffff00;
  height: 100%;
  width: calc(100% - 100px);
  font-size: 15px;
}
.searchbar .input:focus {
  border: none;
  background-color: #ffffff00;
  outline: none;
}
.searchbar .button {
  float: inline-end;
  position: relative;
  right: -10px;
  margin-top: -2px;
  height: calc(100% + 4px);
  border-radius: 12px;
  width: 100px;
}
.searchbar .button:hover {
  animation: flow 3s infinite;
  animation-timing-function: linear;
}
@keyframes flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100%;
    background-color: blue;
    color: white;
  }
  100% {
    background-position: 100%;
  }
}
.searchbar .button:active {
  background-color: green;
}
.menu-panel {
  padding-top: 20px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-height: 100px;
  max-height: calc(100vh - 220px);
  position: absolute;
  top: 80px;
  left: 0;
  overflow: hidden;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  z-index: 10;
}
.catclass {
  width: 100%;
  margin: 0;
  padding-left: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
}
.background-selected {
  background-color: #0a000024;
}
.product-type-img {
  max-width: 100px;
  height: 100px;
}
</style>
