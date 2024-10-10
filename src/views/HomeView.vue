<script setup lang="ts">
import TopFixed from '@/components/top/TopFixed.vue'
import ButtonView from '@/components/Common/ButtonView.vue'
import { useMenuItemsStore } from '@/store/menuItems'
</script>

<template>
  <TopFixed class="desktop-only"></TopFixed>

  <!-- //animation background -->
  <div class="hero bgloadding">
    <div class="cube"></div>
    <div class="cube"></div>
    <div class="cube"></div>
    <div class="cube"></div>
    <div class="cube"></div>
    <div class="cube"></div>

    <!-- Banner Image -->
    <div class="bannerimage">
      <div class="w-full h-full" style="background-color: rgb(0 63 153 / 63%)">
        <div class="hero__title shadow-otto">
          Artificially intelligent B2B E-commerce platform for trade in PURAN DHAKA with all over
          BANGLADESH
        </div>
      </div>
    </div>

    <!--   for each subcatagory -->
    <div class="subcatviewrow" v-for="cat in allitems" :key="cat.id">
      <!-- Subcatagory name -->
      <div class="title">
        <span class="bgpanel">
          <ButtonView
            color="var(--color-fulltransparent)"
            class="transparent-button but-on-underline"
            >{{ cat.name }}</ButtonView
          >
        </span>
      </div>
      <!-- ~10 subcatagories products panel group-->
      <div class="sectop">
        <div class="leftslide" @click="scroolLeft('cat_content_' + cat.id, 100)"></div>
        <div class="top no-scrollbar" :id="'cat_content_' + cat.id">
          <div class="first">
            <!-- for each subcatagory-->
            <div
              class="cat"
              v-for="sub in cat.subCategories"
              :key="sub.id"
              @click="gotoSubCatPage(sub.id)"
            >
              <!-- show 4 product images-->
              <div class="w-full flex image-box-height flex-wrap">
                <img
                  v-for="prod in getSubProdThumb(sub)"
                  :key="prod.id"
                  class="w-100 h-90"
                  :src="prod.thumbnail"
                  onerror="this.onerror=null; this.src='/src/assets/svg/no_image.svg'"
                />
              </div>
              <div class="w-full text-center text-wrap">{{ sub.name }}</div>
            </div>
          </div>
        </div>
        <div class="rightside" @click="scroolRight('cat_content_' + cat.id, 100)"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      count: 1,
      menustore: useMenuItemsStore(),
      allitems: useMenuItemsStore().$state.commonCat
    }
  },
  mounted() {
    this.getDataFromStore()
    console.log(this.allitems)
  },
  updated() {},
  methods: {
    getDataFromStore() {
      var all = this.menustore.allCats
      this.allitems = all.map((cat) => {
        return {
          id: cat.id,
          name: cat.name,
          subCategories: cat.subCategories.map((sub) => {
            return {
              id: sub.id,
              name: sub.name,
              svg_name: '',
              products: sub.product_types.flatMap((pt) => {
                return pt.mostSoldTenProducts.flatMap((prod) => [prod])
              })
            }
          })
        }
      })
    },
    getSubProdThumb(subCatItem: subCategories_c) {
      //console.log(subCatItem)
      return [
        subCatItem.products[this.getHelpRand(subCatItem.products.length)],
        subCatItem.products[this.getHelpRand(subCatItem.products.length)],
        subCatItem.products[this.getHelpRand(subCatItem.products.length)],
        subCatItem.products[this.getHelpRand(subCatItem.products.length)]
      ]
    },
    getHelpRand(max: number) {
      return Math.floor(Math.random() * max)
    },
    scroolLeft(id: string, l: number) {
      //console.log('Go left of ' + id)
      let content = document.querySelector('#' + id)
      if (content) content.scrollLeft -= l
    },
    scroolRight(id: string, l: number) {
      //console.log('Go right of ' + id)
      let content = document.querySelector('#' + id)
      if (content) content.scrollLeft += l
    },
    gotoSubCatPage(sid: number) {
      this.$router.push({ name: 'CatagoryView', params: { id: sid } })
    }
  }
}
</script>
<style scoped>
.bgloadding {
  width: 100%;
  height: calc(100% - 93px);
  /* background-image: url(/src/assets/svg/robot_in_technology.svg); */
}
@media (max-width: 700px) {
  .bgloadding {
    height: auto;
    position: absolute;
    top: 0px;
    z-index: 0;
  }
}
.bannerimage {
  position: relative;
  background-image: url(/src/assets/svg/robot_in_technology.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-clip: content-box;
  background-size: cover;
  width: 100%;
  height: 75vh;
}
</style>
