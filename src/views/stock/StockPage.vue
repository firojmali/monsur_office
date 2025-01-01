<template>
  <div class="w-full flex">
    <div class="w-1/3">
      <!-- <el-button v-if="current_job == 'show'" @click="handleAdd" type="primary" class="m-2">
        Add Product
      </el-button> -->
    </div>
    <div class="w-1/3 text-center">
      <b v-if="current_job == 'add'">Stock Balance</b>
      <b v-if="current_job == 'show'">Stock Balance</b>
      <b v-if="current_job == 'edit'">EDIT: {{ handleProduct.name }}</b>
    </div>
    <div v-if="current_job == 'show'" class="w-1/3">
      <el-input
        v-model="searchintable"
        size="small"
        placeholder="Type to search"
        @input="filterTableData()"
      />
    </div>
  </div>
  <!-- Show Products -->
  <el-table
    v-if="current_job == 'show'"
    :data="showproducts"
    v-loading="show_table_loadding"
    style="max-width: 95%; margin: auto; margin-top: 2px; margin-bottom: 8px"
  >
    <el-table-column label="ID" width="90">
      <template #default="scope">
        <el-button size="small" @click="handlechallanhistry(scope.row)" type="primary">
          {{ scope.row.id }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="Product">
      <template #default="scope">
        <el-tag :type="scope.row.is_complete ? 'primary' : 'success'" disable-transitions
          >{{ scope.row.type }} </el-tag
        >:
        <el-tag :type="scope.row.is_saleable ? 'primary' : 'success'" disable-transitions>{{
          scope.row.name
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Good Balance" width="120">
      <template #default="scope">
        <span :style="{ color: scope.row.stock ? 'black' : 'red' }">{{
          scope.row.stock ? scope.row.stock.quantity_good + ' ' + scope.row.unit.unit : 'Not Fond'
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Damaged Balance" width="160">
      <template #default="scope">
        <span :style="{ color: scope.row.stock ? 'black' : 'red' }">
          {{
            scope.row.stock
              ? scope.row.stock.quantity_damaged + ' ' + scope.row.unit.unit
              : 'Not Fond'
          }}</span
        >
      </template>
    </el-table-column>
    <el-table-column label="Total Balance" width="120">
      <template #default="scope">
        <span :style="{ color: scope.row.stock ? 'black' : 'red' }"
          >{{
            scope.row.stock
              ? scope.row.stock.quantity_good + scope.row.stock.quantity_damaged
              : 'Not Fond'
          }}
          {{ scope.row.stock ? scope.row.unit.unit : '' }}</span
        >
      </template>
    </el-table-column>
  </el-table>
  <!-- <el-dialog v-model="showchallan.visible" :title="showchallan.title" width="800"> -->
  <ShowStockChallan
    v-if="current_job == 'challan'"
    :dataRecord="showchallan.dataRecord"
    @close="gotoshow()"
  />
  <!-- </el-dialog> -->
</template>
<script lang="ts" setup>
//import { useMenuItemsStore } from '@/store/menuItems'

import { getProductsWithStockBalance } from '@/api/product'
import ShowStockChallan from './ShowStockChallan.vue'
import '@/functions/interfeces'

//import AddEditProduct from './AddEditProduct.vue'
//const search = ref('')
</script>
<script lang="ts">
export default {
  data() {
    const showproducts: Product[] = []
    const products: Product[] = []
    const handleProduct: any = {}
    const productUnits: Unit[] = []
    return {
      dataRecord: {
        current_job: 'add',
        rowValue: {}
      },
      activework: false,
      user_name: 'MFMALI',
      current_job: 'show', // show add edit
      show_table_loadding: true,
      searchintable: '',
      current_page: 1,
      products,
      showproducts,
      handleProduct,
      productUnits,
      stocktableshow: true,
      count: 1,
      showchallan: { dataRecord: {}, visible: false, title: '' },
      productTypes: [
        'Lamp',
        'Lamp SKD Items',
        'Cable',
        'Motor',
        'Inverter',
        'PV Module',
        'Connector',
        'Tools',
        'Chemical'
      ]
    }
  },
  mounted() {
    this.getproductswithstockbalance()
    this.user_name = 'MFMALI'
    //console.log(this.user_name)
  },
  updated() {
    // this.getproductswithstockbalance()
  },
  methods: {
    gotoshow() {
      this.current_job = 'show'
    },
    handlechallanhistry(row: any) {
      this.showchallan.dataRecord = {
        product_uid: row.stock.product_uid,
        from: row.stock.created_at,
        to: 'last',
        opening_good: row.stock.opening_quantity_good,
        opening_damaged: row.stock.opening_quantity_damaged,
        good_quantity: row.stock.quantity_good,
        damaged_quantity: row.stock.quantity_damaged,
        name: row.name
      }
      this.showchallan.visible = true
      this.showchallan.title = 'Stock History Of  ' + row.name
      this.current_job = 'challan'
    },
    doneaddedit() {
      this.getproductswithstockbalance(this.current_page)
      this.current_job = 'show'
    },
    canceledit() {
      this.current_job = 'show'
    },
    // getproductswithstockbalance1(page: number = 1, loaddingshow = true) {
    //   this.show_table_loadding = loaddingshow
    //   return new Promise((resolve, reject) => {
    //     getproductswithstockbalance(page)
    //       .then((res: any) => {
    //         this.products = res.data.data
    //         this.productPagination = res.data
    //         this.filterTableData()
    //         this.show_table_loadding = false
    //         res
    //       })
    //       .catch((err: string) => {
    //         reject(false)
    //         err
    //       })
    //   })
    // },
    getproductswithstockbalance(page: number = 1, loaddingshow = true) {
      this.show_table_loadding = loaddingshow
      if (page) {
        page = page + 1 - 1
      } //no need
      return new Promise((resolve, reject) => {
        getProductsWithStockBalance('all')
          .then((res: any) => {
            this.products = res.data
            this.filterTableData()
            this.show_table_loadding = false
            res
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    handleAdd() {
      this.dataRecord = {
        current_job: 'add',
        rowValue: {}
      }
      this.current_job = 'add'
    },
    filterTableData() {
      this.showproducts = this.products.filter(
        (data) =>
          !this.searchintable ||
          data.name.toLowerCase().includes(this.searchintable.toLowerCase()) ||
          data.type.toLowerCase().includes(this.searchintable.toLowerCase())
      )
    },
    handleEdit(index: number, row: User) {
      this.dataRecord = {
        current_job: 'edit',
        rowValue: { ...row }
      }
      this.current_job = 'edit'
    },
    handleDelete(index: number, row: User) {
      console.log(index, row)
    }
  }
}
</script>
<style scoped>
tr:nth-child(even) {
  background-color: #f2f2f2;
}
td {
  text-align: center;
}
</style>
