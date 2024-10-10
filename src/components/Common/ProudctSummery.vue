<script setup lang="ts">
import '@/functions/interfeces'
import self_ts from '@/functions/self'
</script>
<template>
  <div class="caret-yellow-50 box">
    <div class="cursor-pointer hover:opacity-55" @click="$emit('clickProduct')">
      <div class="img-div fw">
        <img @hover="opc = true" :src="productObject.thumbnail" class="middle opci" />
      </div>
      <div class="name-div fw text-center text-xl animated-over-text">
        <p class="text-animated">
          {{ productObject.name }}
        </p>
      </div>
    </div>
    <div class="price-div fw font-bold text-center bg-slate-950 text-white">
      <p>{{ getPriceRange(productObject.prices) }}</p>
      <p align="right" class="small">min {{ getMinQuantity(productObject.prices) }}</p>
    </div>
    <div class="des-div fw">
      <p class="w-full h-full">
        short description short description short description short description short description
        short description short description short descriptionshort description short description
      </p>
      <div class="relative bottom-5 left-0 w-full h-5 bg-white/50">
        <button class="button-more v-butt w-fit mb-2" role="button" @click="$emit('view')">
          <b>View...</b>
        </button>
      </div>
    </div>
    <div class="button-height fw">
      <button class="button-add-cart w-full text-center" role="button" @click="$emit('addToCart')">
        Add to Cart
      </button>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    productObject: {
      type: Object,
      default: () => ({
        prices: [
          { unit: '', price: '100', quantity: 10 },
          { unit: '', price: '100', quantity: 10 }
        ],
        id: 1,
        thumbnail: '',
        images: '',
        name: '',
        sub_catagory: {},
        product_type_id: 1
      })
    },
    pageType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      opc: false
    }
  },
  methods: {
    getPriceRange(priceList: productPrice[]) {
      return (
        'Tk: ' +
        self_ts.minPrice(priceList) +
        ' ~ ' +
        self_ts.maxPrice(priceList) +
        ' /' +
        self_ts.getUnit(priceList)
      )
    },
    getMinQuantity(priceList: productPrice[]) {
      return self_ts.minOrder(priceList) + ' ' + self_ts.getUnit(priceList)
    }
  }
}
</script>
<style scoped>
/* --product-summery-box-width:200px;
  --product-summery-box-height:300px;
  --product-summery-img-height:200px;
  --product-summery-description-height:50px;
  --product-summery-price-height:20px;
  --product-summery-button-height:30px; */
.fw {
  width: 100%;
}
.img-div {
  height: var(--product-summery-img-height);
}
.des-div {
  height: var(--product-summery-description-height);
  overflow: hidden;
}
.price-div {
  height: var(--product-summery-price-height);
}
.name-div {
  height: var(--product-summery-name-height);
}
.button-height {
  height: var(--product-summery-button-height);
}
.box {
  width: var(--product-summery-box-width);
  height: var(--product-summery-box-height);
}
.v-but {
  margin-left: 40%;
  width: 20%;
}
.small {
  padding: 0px 4px 0px 0px;
  margin: 0px;
  margin-top: -4px;
  font-size: 11px;
}
.opci {
  opacity: inherit;
}
</style>
