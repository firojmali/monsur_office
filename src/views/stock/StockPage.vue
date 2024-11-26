<template>
  <div class="w-full flex">
    <div class="w-1/3">
      <el-button v-if="current_job == 'show'" @click="handleAdd" type="primary" class="m-2">
        Add Product
      </el-button>
    </div>
    <div class="w-1/3 text-center">
      <b v-if="current_job == 'add'">ADD PRODUCT</b>
      <b v-if="current_job == 'show'">PRODUCTS</b>
      <b v-if="current_job == 'edit'">EDIT: {{ handleProduct.name }}</b>
    </div>
    <div v-if="current_job == 'show'" class="w-1/3">filter</div>
  </div>
  <!-- Show Products -->
  <el-table v-if="current_job == 'show'" :data="showproducts" v-loading="show_table_loadding">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="Name" sortable prop="name" />
    <el-table-column label="Type" sortable prop="type" />
    <el-table-column label="Identity">
      <template #default="scope">
        <el-tag :type="scope.row.is_complete ? 'primary' : 'success'" disable-transitions
          >{{ scope.row.is_complete ? 'Complete Product' : 'Raw Materials' }}
        </el-tag>
        <el-tag v-if="!scope.row.is_saleable" type="info" disable-transitions>Not For Sale</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Unit">
      <template #default="scope">{{ scope.row.unit.unit }}</template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input
          v-model="searchintable"
          size="small"
          placeholder="Type to search"
          @input="filterTableData()"
        />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> Edit </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
//import { useMenuItemsStore } from '@/store/menuItems'

import { getProductsWithStockBalance } from '@/api/product'
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
  updated() {},
  methods: {
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
          !this.searchintable || data.name.toLowerCase().includes(this.searchintable.toLowerCase())
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
