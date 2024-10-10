<script lang="ts"></script>
<template>
  <div class="w-full text-center font-bold">
    {{ productObject.name }} [{{ pageType ? 'Add to Cart Confirmation' : 'Details' }}]
  </div>
  <div>{{ productObject }}</div>
</template>
<script lang="ts">
export default {
  props: ['productObject', 'pageType'],
  data() {
    return {
      product: {}
    }
  },
  update() {
    //this.product = this.productObject
  },
  mounted() {
    this.product = this.productObject
    this.show()
  },
  methods: {
    show() {
      //let a = URLParams.getAll()
      console.log(this.product)
      return this.product
    }
  }
}
</script>
