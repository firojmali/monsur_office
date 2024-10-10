<script setup lang="ts">
import { useMenuItemsStore } from '@/store/menuItems'
import SingleProduct from '@/components/Common/SingleProduct.vue'
import DiagonalDialog from '../Common/DiagonalDialog.vue'
import ProudctSummery from '@/components/Common/ProudctSummery.vue'
</script>

<template>
  <!-- for each product types a container -->
  <div
    v-for="prodt in allProductTypes"
    :key="prodt.id"
    class="container-product-type w-full flex bg-gray-200 rounded-md my-4"
  >
    <!-- product type name-->
    <div class="w-16">
      <div
        class="rotate-90"
        v-bind:style="{
          'margin-top': (prodt.mostSoldTenProducts.length / ((windowWidth - 20) / 200)) * 140 + 'px'
        }"
      >
        <!-- (prodt.mostSoldTenProducts.length / ((windowWidth - 20) / 200)) * 70 -->
        {{ prodt.name }}
      </div>
    </div>
    <!-- last panel for 10 most sold product of this type-->
    <div class="product-container m-1 flex flex-wrap bg-cyan-50">
      <!-- for each product-->
      <!-- <div
        style="width: 200px; height: fit-content !important"
        class="cat mx-auto my-6"
        v-for="prod in prodt.mostSoldTenProducts"
        :key="prod.id"
        @click="gotoProductPage(prod)"
      > -->
      <ProudctSummery
        v-for="item in prodt.mostSoldTenProducts"
        :key="item.id"
        :productObject="item"
        class="m-2 panel-shadow"
        @clickProduct="gotoProductPage(item, 0)"
        @addToCart="gotoProductPage(item, 1)"
        @view="gotoProductPage(item, 0)"
      />
      <!-- </div> -->
      <!-- <div
        style="width: 200px; height: fit-content !important"
        class="cat mx-auto my-6"
        v-for="prod in prodt.mostSoldTenProducts"
        :key="prod.id"
        @click="gotoProductPage(prod)"
      >
        <div style="height: 200px; max-width: 100%">
          <img
            style="height: 200px; max-width: 100%"
            :src="prod.thumbnail"
            onerror="this.onerror=null; this.src='/src/assets/svg/no_image.svg'"
          />
        
        </div>
        <div class="w-full text-center text-wrap" style="height: 50px">
          <b
            >{{ prod.name }} <br />~
            {{ self_ts.minPrice(prod.prices, 3) + ' Tk / ' + self_ts.getUnit(prod.prices) }}</b
          >
          
        </div>
      </div> -->
      <div
        style="height: 240px; width: 200px; background-color: black"
        class="cat mx-auto my-6"
        @click="gotomoreProductPage(prodt.id)"
      >
        <div class="more-svg">
          <div class="w-full text-center caret-stone-50 more_svg_text">....More</div>
        </div>
      </div>
    </div>
  </div>
  <DiagonalDialog
    v-if="is_active"
    @close="is_active = false"
    bgcolor="#e3ebeb"
    height="50%"
    width="70%"
  >
    <SingleProduct :productObject="currentProduct" :pageType="pagetype"></SingleProduct>
  </DiagonalDialog>
</template>
<script lang="ts">
export default {
  props: ['catId'],
  data() {
    return {
      menustore: useMenuItemsStore(),
      count: 1,
      is_active: false,
      cat_id: 0,
      allcats: useMenuItemsStore().allCats,
      allProductTypes: [
        {
          image: '',
          name: '',
          id: 1,
          mostSoldTenProducts: [
            {
              images: 'string',
              name: 'string',
              id: 1,
              thumbnail: 'string',
              prices: [
                {
                  price: 1,
                  quantity: 1,
                  unit: 'string'
                }
              ],
              sub_catagory: {
                id: 1,
                name: 'sdf',
                catagory: {
                  id: 1,
                  name: 'sd'
                }
              },
              product_type_id: 1
            }
          ]
        }
      ],
      pagetype: 0,
      currentProduct: {
        images: 'string',
        name: 'string',
        id: 1,
        thumbnail: 'string',
        prices: [
          {
            price: 1,
            quantity: 1,
            unit: 'string'
          }
        ],
        sub_catagory: {
          id: 1,
          name: 'sdf',
          catagory: {
            id: 1,
            name: 'sd'
          }
        },
        product_type_id: 1
      },
      x: {},
      windowWidth: window.innerWidth
    }
  },
  mounted() {
    this.cat_id = this.catId
    this.getAllProductTypes()
    //console.log('mounted', this.allProducttypes)
  },
  updated() {
    this.allcats = this.menustore.allCats
    this.cat_id = this.catId
    this.getAllProductTypes()
    // console.log(this.allProductTypes)
  },
  watch: {
    count(newV, oldV) {
      console.log('Count from ', oldV, ' to ', newV)
    }
  },
  methods: {
    getAllProductTypes() {
      this.allcats.find((cat) => {
        cat.subCategories.find((sub) => {
          if (parseInt(String(sub.id)) == parseInt(String(this.cat_id)))
            this.allProductTypes = sub.product_types
        })
      })
    },
    gotoProductPage(prod: product, type: number) {
      this.is_active = false
      this.currentProduct = prod
      this.pagetype = type
      this.is_active = true
      //prod.id = 2
      //self_ts.openSingleProductPage(prod)
      //this.$router.push({ name: 'showsingleproduct', params: { id: prod.id } })
    },
    gotomoreProductPage(id: number) {
      this.$router.push({ name: 'showmultiproduct', params: { id: id } })
    }
  }
}
</script>
<style scoped>
.product-container {
  width: calc(100% - 74px);
  border-radius: 10px;
  min-height: 150px;
  justify-content: space-evenly;
}
.more_svg_text {
  margin-top: 50%;
  color: #fbfbfb;
  font-size: 30px;
  padding-top: 170px;
  font-weight: 700;
}
</style>
