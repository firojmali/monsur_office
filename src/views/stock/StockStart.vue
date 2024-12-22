<template>
  <div class="w-full flex">
    <div class="w-1/3">
      <!--
        <el-button v-if="current_job == 'show'" @click="handleAdd" type="primary" class="m-2">
          Add Product
        </el-button> 
      -->
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
  <el-button :disabled="activework" @click="insertproduct" type="success" class="m-2">
    Next
  </el-button>
  <el-form
    ref="ruleFormRef"
    :model="handleProduct"
    :rules="rules"
    label-width="auto"
    label-position="top"
    class="w-full flex mt-8"
    status-icon
  >
    <!-- Show Products -->
    <el-table
      v-if="current_job == 'show'"
      :data="showproducts"
      v-loading="show_table_loadding"
      style="max-width: 95%; margin: auto; margin-top: 2px; margin-bottom: 8px"
    >
      <el-table-column label="ID" prop="id" width="90" />
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
      <el-table-column label="Good Balance" width="250">
        <template #default="scope">
          <el-form-item>
            <el-input-number
              v-model="tinputs.good[scope.row.uid]"
              @input="consoleme(tinputs.good[scope.row.uid])"
            >
              <template #suffix>
                <span>{{ scope.row.unit.unit }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Damaged Balance" width="160">
        <template #default="scope">
          <el-form-item>
            <el-input-number
              v-model="tinputs.bad[scope.row.uid]"
              @input="consoleme(tinputs.bad[scope.row.uid])"
            >
              <template #suffix>
                <span>{{ scope.row.unit.unit }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Total Balance" width="120">
        <template #default="scope">
          {{ addtotal(tinputs.good[scope.row.uid], tinputs.bad[scope.row.uid]) }}
          {{
            addtotal(tinputs.good[scope.row.uid], tinputs.bad[scope.row.uid])
              ? ' ' + scope.row.unit.unit
              : ''
          }}
        </template>
      </el-table-column>
    </el-table>
  </el-form>

  <!-- dialog before entry of opening stock-->
  <el-dialog v-model="dialogvisible" :show-close="false" :fullscreen="true">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">Are Sure to Enter these opening balance</h4>
        <el-button type="danger" @click="close" :disabled="activework">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </div>
    </template>
    <el-table
      :data="datasend"
      style="max-width: 95%; margin: auto; margin-top: 2px; margin-bottom: 8px"
    >
      <el-table-column label="Product">
        <template #default="scope">
          {{ getProductTypeName(scope.row.product_uid) }}
        </template>
      </el-table-column>
      <el-table-column label="Good Quantity" width="200">
        <template #default="scope">
          {{ scope.row.quantity_good }} {{ productlist[scope.row.product_uid].unit.unit }}
        </template>
      </el-table-column>
      <el-table-column label="Damaged Quantity" width="200">
        <template #default="scope">
          {{ scope.row.quantity_damaged }} {{ productlist[scope.row.product_uid].unit.unit }}
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button :disabled="activework" @click="dialogvisible = false">Cancel</el-button>
        <el-button :disabled="activework" type="primary" @click="submittoserver()">
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getProductsWithStockBalance } from '@/api/product'
import { insertOpeningStock } from '@/api/stock'
import '@/functions/interfeces'
</script>
<script lang="ts">
export default {
  data() {
    const showproducts: Product[] = []
    const products: any = []
    const handleProduct: any = {}
    const productUnits: Unit[] = []
    const tinputs: any = { good: {}, bad: {} }
    const datasend: any = []
    const productlist: any = {}
    return {
      tinputs,
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
      datasend,
      productlist,

      dialogvisible: false,
      rules: []
    }
  },
  mounted() {
    this.tinputs = { good: {}, bad: {} }
    this.getproductswithstockbalance()
  },
  updated() {},
  methods: {
    submittoserver() {
      this.activework = true
      return new Promise((resolve, reject) => {
        insertOpeningStock({ data: this.datasend })
          .then((res: any) => {
            this.activework = false
            this.dialogvisible = false
            this.show_table_loadding = true
            this.getproductswithstockbalance()
            res
          })
          .catch((err: any) => {
            this.activework = false
            err
          })
      })
    },
    getProductTypeName(uid: string) {
      //let typename=''
      //this.showproducts.forEach((product:Product)=>{
      // if(product.uid)
      //})
      return this.productlist[uid].type + ' : ' + this.productlist[uid].name
    },
    insertproduct() {
      this.consoleme(Object.entries(this.tinputs))
      let data: any = []
      Object.entries(this.tinputs.good).forEach((el) => {
        if (typeof data[el[0]] == 'undefined') {
          data[el[0]] = { good: null, bad: null }
        }
        data[el[0]].good = el[1]
      })
      Object.entries(this.tinputs.bad).forEach((el) => {
        if (typeof data[el[0]] == 'undefined') {
          data[el[0]] = { good: null, bad: null }
        }
        data[el[0]].bad = el[1]
      })
      let datasend: any = []
      const dt = new Date()
      const year = dt.getFullYear()
      const month = (dt.getMonth() + 1).toString().padStart(2, '0')
      const day = dt.getDate().toString().padStart(2, '0')
      const ymd = year.toString() + month + day
      Object.entries(data).forEach((value: any) => {
        if (value[1].good != null || value[1].bad != null) {
          value[1].good = value[1].good == null ? 0 : value[1].good
          value[1].bad = value[1].bad == null ? 0 : value[1].bad
          datasend.push({
            product_uid: value[0],
            quantity_good: value[1].good,
            quantity_damaged: value[1].bad,
            opening_quantity_good: value[1].good,
            opening_quantity_damaged: value[1].bad,
            opening_date: ymd,
            challan_uids: ' ',
            remarks: 'Opening Balance'
          })
        }
      })
      if (datasend.length) {
        this.datasend = datasend
        this.dialogvisible = true
      }
    },
    addtotal(g: number, b: number) {
      if (g == null) {
        return b
      }
      if (b == null) {
        return g
      }
      return b + g
    },
    consoleme(cn: any) {
      console.log(cn)
      if (cn == null) console.log('null fond')
    },

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
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    filterTableData() {
      this.showproducts = this.products.filter(
        (data: any) =>
          !data.stock &&
          (!this.searchintable ||
            data.name.toLowerCase().includes(this.searchintable.toLowerCase()))
      )
      this.showproducts.forEach((prd) => {
        if (!this.tinputs.good[prd.uid]) this.tinputs.good[prd.uid] = null
        if (!this.tinputs.bad[prd.uid]) this.tinputs.bad[prd.uid] = null
        if (!this.productlist[prd.uid]) {
          this.productlist[prd.uid] = { ...prd }
        }
      })
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
.el-form-item {
  margin-bottom: 1px;
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
