<template>
  <el-card style="width: 480px; margin: auto" shadow="always">
    <template #header>
      <div class="card-header">
        <span>Manufactureable Product List</span>
      </div>
    </template>
    <div class="w-full text-right">
      <el-button type="primary" @click="handleAdd">Add Manufactring Product</el-button>
    </div>
    <el-table :data="productsManu" style="width: 100%"> </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="Add Manufacturing Product" fullscreen width="100%">
    <el-form :model="addform" :rules="rules" label-width="auto" style="max-width: 99%">
      <el-form-item label="Product Tobe Manufactured">
        <el-select v-model="addform.product_uid" placeholder="please select Product to Manufacture">
          <el-option
            v-for="item in productsNotManu"
            :key="item.uid"
            :label="item.name + ' >   1 ' + item.unit.unit"
            :value="item.uid"
          />
        </el-select>
        <el-form-item label="remarkss "
          ><el-input type="textarea" row="3" v-model="addform.remarks"
        /></el-form-item>
      </el-form-item>
      <el-card style="width: 99%; margin: auto" shadow="always">
        <template #header>
          <div class="card-header">
            <div class="float-left">Required Items</div>
            <div class="float-right">
              <el-button type="primary" @click="handleAddItem" :disabled="adding"
                >Add Required Item</el-button
              >
            </div>
          </div>
        </template>
        <el-table :data="addform.items" style="width: 100%">
          <el-table-column label="Item Name" min-width="320">
            <template #default="scope">
              <el-select v-model="scope.row.product_uid" placeholder="please select Item">
                <el-option
                  v-for="item in products"
                  :key="item.uid"
                  :label="item.name + ' > in ' + item.unit.unit"
                  :value="item.uid"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Quantity">
            <template #default="scope">
              <el-input v-model="scope.row.quantity" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click.prevent="deleteitem(scope.$index)"
                :disabled="adding"
              >
                Remove
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addmanuproduct" :disabled="adding"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup></script>
<script lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import moment from 'moment'
//import { Plus } from '@element-plus/icons-vue'

import { getProductswithManu, insertManuProduct } from '@/api/manu'
export default {
  name: 'ManuProducts',
  data() {
    const products: any = []
    const productsManu: any = []
    const productsNotManu: any = []
    //const ruleFormRef = ref<FormInstance>()
    //const $refs: any = {}
    return {
      products,
      productsManu,
      productsNotManu,
      adding: false,
      addform: {
        product_uid: null,
        remarks: '',
        items: [{ product_uid: null, quantity: 0 }]
      },
      wait: true,
      dialogVisible: false,
      blank_date_ref: ref(''),
      rules: {
        product_uid: [
          { required: true, message: 'Please select at the product type', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: "Please input Product's name", trigger: 'blur' },
          { min: 3, message: ' Name Should be minimum 3 Charecter', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getproducts()
  },
  updated() {},
  methods: {
    addmanuproduct() {
      let msg = null
      //this.adding = true
      console.log(this.addform)

      if (this.addform.items.length < 2) {
        msg = 'Please select Two or more items'
      }
      if (this.addform.items.length > 1) {
        this.addform.items.forEach((item: any) => {
          if (item.product_uid == null || parseFloat(item.quantity) <= 0) {
            msg = 'At least One item is blank or quantity is 0'
          }
        })
      }
      if (this.addform.product_uid == null) {
        msg = 'Please select a Manufactured Product'
      }

      if (msg == null) {
        console.log('success')
        this.insert()
        //this.dialogVisible = false
      } else {
        ElMessage.error(msg)
        this.adding = false
      }
    },
    handleAdd() {
      this.dialogVisible = true
      this.addform = {
        product_uid: null,
        remarks: '',
        items: []
      }
      this.adding = false
    },
    handleAddItem() {
      this.addform.items.push({ product_uid: null, quantity: 0 })
    },
    deleteitem(index: number) {
      this.addform.items.splice(index, 1)
    },
    tosqldate(d: string) {
      return moment(d).format('YYYY-MM-DD')
    },
    getproducts() {
      return new Promise((resolve, reject) => {
        getProductswithManu()
          .then((res: any) => {
            this.products = res.data
            this.filterproducts()
            this.wait = false
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    insert() {
      let adc: any = {
        product_uid: this.addform.product_uid,
        remarks: this.addform.remarks,
        items: []
      }
      this.addform.items.forEach((item) => {
        adc.items.push({
          product_uid: item.product_uid,
          quantity: parseFloat(String(item.quantity))
        })
      })
      return new Promise((resolve, reject) => {
        insertManuProduct(this.addform)
          .then((res: any) => {
            this.products = res.product
            console.log(res.data)
            this.filterproducts()
            this.dialogVisible = false
            this.wait = false
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    //insertManuProduct
    filterproducts() {
      this.productsManu = this.products.filter((product: any) => {
        return product.manuproduct != null
      })
      this.productsNotManu = this.products.filter((product: any) => {
        return product.manuproduct == null
      })
    }
  }
}
</script>
<style scoped>
div_underline {
  border: 2px solid;
}
</style>
