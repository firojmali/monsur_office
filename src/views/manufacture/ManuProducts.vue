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
    <el-table :data="productsManu" style="width: 100%">
      <el-table-column label="Product Name" prop="name"></el-table-column>
      <el-table-column label="Action">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="editproduct(scope.row)"
            :disabled="adding"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="is_new ? 'Add Manufacturing Product' : 'Edit Manufacturing Product'"
    fullscreen
    width="100%"
  >
    <el-form :model="addform" :rules="rules" label-width="auto" style="max-width: 99%">
      <el-form-item
        :label="is_new ? 'Product Tobe Manufactured' : 'Edit Manufacturing item list for'"
      >
        <el-select
          v-if="is_new"
          v-model="addform.product_uid"
          placeholder="please select Product to Manufacture"
        >
          <el-option
            v-for="item in productsNotManu"
            :key="item.uid"
            :label="item.name + ' >   1 ' + item.unit.unit"
            :value="item.uid"
          />
        </el-select>
        <span v-else
          ><b> '{{ editproductname }}'</b><br />
        </span>
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
        <el-button type="primary" @click="addmanuproduct" :disabled="adding">
          {{ is_new ? 'Save' : 'Update' }}
        </el-button>
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

import {
  getmanuproductsitems,
  getProductswithManu,
  insertManuProduct,
  updateManuProduct
} from '@/api/manu'
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
      editproductname: '',
      is_new: true,
      update_uid: '',
      addform: {
        product_uid: null,
        remarks: '',
        items: [{ product_uid: null, quantity: 0 }]
      },
      prevAddform: {
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
    editproduct(s: any) {
      this.editproductname = s.name
      s = s.manuproduct
      this.update_uid = s.uid
      this.is_new = false
      this.adding = true
      this.addform = {
        product_uid: s.product_uid,
        remarks: s.remarks,
        items: []
      }
      this.prevAddform.product_uid = s.product_uid
      this.prevAddform.remarks = s.remarks
      this.prevAddform.items = []
      this.wait = true
      new Promise((resolve, reject) => {
        getmanuproductsitems(s.uid)
          .then((res: any) => {
            res.data.items.forEach((item: any) => {
              this.addform.items.push({ ...item })
              this.prevAddform.items.push({ ...item })
            })
            this.adding = false
            this.wait = false
            this.dialogVisible = true
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
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
        if (this.is_new) this.insert()
        else this.update()
        //this.dialogVisible = false
      } else {
        ElMessage.error(msg)
        this.adding = false
      }
    },
    handleAdd() {
      this.is_new = true
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
    update() {
      let upd: any = []
      let del: any = []
      let add: any = []
      let a = 0
      let b = 0
      let item_got = { product_uid: null, quantity: 0 }

      this.prevAddform.items.forEach((item) => {
        a = 0
        b = 0
        console.log(item.product_uid)
        item_got = { product_uid: null, quantity: 0 }
        this.addform.items.forEach((nitem) => {
          if (item.product_uid == nitem.product_uid) {
            item_got = { ...nitem }
            console.log('with=', nitem.product_uid)
            a = 1
            if (item.quantity == nitem.quantity) {
              b = 1
            }
          }
        })
        console.log('got = ', a)
        if (a && !b) {
          upd.push({ ...item_got })
        }
        if (!a) {
          del.push(item.product_uid)
        }
      })

      this.addform.items.forEach((nitem) => {
        a = 0
        this.prevAddform.items.forEach((item) => {
          if (item.product_uid == nitem.product_uid) {
            a = 1
          }
        })
        if (!a) {
          add.push({ ...nitem })
        }
      })
      const manu_update =
        this.prevAddform.remarks != this.addform.remarks ? this.addform.remarks : null
      let dataToSend = { manu: manu_update, upd: [], del: [], add: [] }
      console.log('prev = ', this.prevAddform)
      console.log('add = ', add)
      console.log('del = ', del)
      console.log('upd = ', upd)
      if (!add.length && !del.length && !upd.length && manu_update == null) {
        ElMessage.warning('Nothing to Update')
        return 1
      } else {
        dataToSend = { manu: manu_update, upd: upd, del: del, add: add }
      }
      return new Promise((resolve, reject) => {
        updateManuProduct(this.update_uid, dataToSend)
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
