<script setup lang="ts"></script>
<template>
  <TopFixed class="desktop-only"></TopFixed>
  <div class="desktop-only w-full" style="height: 92px"></div>
  <CatIndex :catId="cat_id" />
</template>
<script lang="ts">
export default {
  data() {
    return {
      cat_id: 0
    }
  },
  mounted() {
    this.getrouteparameter()
    // console.log('mounted', this.$route.params.id, this.cat_id)
  },
  watch: {
    $route(newRoute, lastRoute) {
      if (newRoute != lastRoute) this.getrouteparameter()
    }
  },
  methods: {
    getrouteparameter() {
      this.cat_id = parseInt(String(this.$route.params.id))
      console.log('stockid', this.cat_id)
    }
    // menuClicked(params) {
    //   console.log('emit ', params)
    //   var made_r = {
    //     subcategory: {
    //       name: 'CatagoryView',
    //       params: { id: 'id' }
    //     }
    //   }
    //   if (made_r[params.menuname]) {
    //     var rparams = { ...made_r[params.menuname].params }

    //     var par = {}
    //     Object.keys(rparams).forEach(function (key, index) {
    //       //console.log(index) //returns: number
    //       //console.log(key) //returns: string
    //       //console.log(params.args, par)
    //       par[key] = params.args[key]
    //     })
    //     //console.log('name ', made_r[params.menuname].name, 'parms', par)
    //     this.$router.push({ name: made_r[params.menuname].name, params: { ...par } })
    //   }
    // }
  }
}
</script>
