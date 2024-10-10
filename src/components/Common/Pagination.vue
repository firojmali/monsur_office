<script setup lang="ts">
import ButtonView from '@/components/Common/ButtonView.vue'
</script>
<template>
  <ButtonView class="border-content-button" :class="{ active: current_page == 1 }"> 1 </ButtonView>
  <ButtonView class="border-content-button" v-if="is_previous_show"> < Previous </ButtonView>
  <ButtonView class="border-content-button active" v-if="is_curent_show">
    {{ current_page }}
  </ButtonView>
  <ButtonView class="border-content-button" v-if="is_next_show"> < Next </ButtonView>
  <ButtonView
    v-if="pageobject.totalPage > 1"
    class="border-content-button"
    :class="{ active: current_page == pageobject.totalPage }"
  >
    {{ pageobject.totalPage }}</ButtonView
  >
</template>
<script lang="ts">
interface PageObject {
  page: Number
  totalPage: Number
  limit: Number
}
export default {
  props: {
    pageObject: {
      type: Object
    }
  },
  data() {
    return {
      pageobject: {},
      is_previous_show: false,
      is_next_show: false,
      is_curent_show: false,
      current_page: 1,
      is_goto_page_show: false
    }
  },
  mounted() {
    this.pageobject = this.pageObject
    console.log(this.pageObject)
    this.createpagedata()
  },
  updated() {
    this.createpagedata()
  },
  methods: {
    createpagedata() {
      this.current_page = this.pageobject.page

      this.is_previous_show = this.current_page > 2
      console.log(
        'current page = ',
        this.current_page,
        ' :> previous show = ',
        this.is_previous_show
      )
      var currentToLastGap = this.pageobject.totalPage - this.current_page
      this.is_next_show = currentToLastGap > 1

      var noofshoweditem = 2
      if (this.is_previous_show) noofshoweditem++
      if (this.is_next_show) noofshoweditem++

      this.is_goto_page_show = this.pageobject.totalPage > noofshoweditem

      this.is_curent_show = this.current_page != 1 && this.current_page != this.pageobject.totalPage
    }
  }
}
</script>
<style scoped>
.active {
  color: blue;
}
.border-content-button {
  border: 1px solid #7e7e7e !important;
  flex-wrap: nowrap;
  margin: 2px;
  background-color: #eceae6 !important;
  min-width: 30px;
  padding: 2px;
}
</style>
