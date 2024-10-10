<script setup lang="ts">
import '@/functions/interfeces'
import TopFixed from '@/components/top/TopFixed.vue'
import serverdata from '@/sedoserver/serveritems'
import ProudctSummery from '@/components/Common/ProudctSummery.vue'
import SingleProduct from '@/components/Common/SingleProduct.vue'
import DiagonalDialog from '@/components/Common/DiagonalDialog.vue'
</script>

<template>
  <TopFixed class="desktop-only" @update="updateProducts"></TopFixed>
  <div class="desktop-only w-full" style="height: 92px"></div>
  <div v-if="loaded" class="product-container flex flex-wrap m-auto">
    <ProudctSummery
      v-for="item in products"
      :key="item.id"
      :productObject="item"
      class="m-2 panel-shadow"
      @clickProduct="gotoProductPage(item, 0)"
      @addToCart="gotoProductPage(item, 1)"
      @view="gotoProductPage(item, 0)"
    />
  </div>
  <div class="s">sadf</div>
  <!-- <Pagination :pageObject="pageobject" /> -->
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
  props: ['id'],
  data() {
    return {
      loaded: false,
      count: 1,
      type_id: 0,
      pageobject: {
        page: 3,
        totalPage: 12,
        limit: 20
      },
      pagetype: 0,
      is_active: false,
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
      products: [
        {
          images: '',
          name: '',
          id: 1,
          thumbnail: 'a1.png',
          prices: [
            { unit: '', price: 100, quantity: 10 },
            { unit: '', price: 100, quantity: 10 }
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
  },
  mounted() {
    this.type_id = this.id
    this.products = this.getPagedProducts()
    this.loaded = true
    //console.log('mounted', this.products)
  },
  updated() {
    //this.products = this.getPagedProducts()
    //console.log('update', this.products)
  },
  watch: {
    count(newV, oldV) {
      console.log('Count from ', oldV, ' to ', newV)
    }
  },
  methods: {
    getPagedProducts() {
      return serverdata.methods.getproductsoftype(
        this.type_id,
        this.pageobject.page,
        this.pageobject.limit
      )
    },
    gotoProductPage(product: product, type: number) {
      this.is_active = false
      this.currentProduct = product
      this.pagetype = type
      this.is_active = true
      //this.$router.push({ name: 'showsingleproduct', params: { id: product_id } })
    },
    updateProducts() {
      this.products = this.getPagedProducts()
    }
  }
}
</script>
<style scoped>
.product-container {
  width: calc(100% - 74px);
  border-radius: 10px;
  min-height: 150px;
  justify-content: space-between;
}
</style>
