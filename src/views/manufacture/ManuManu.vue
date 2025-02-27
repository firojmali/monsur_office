<template>
  <el-card style="width: 480px; margin: auto" shadow="always">
    <template #header>
      <div class="card-header">
        <span>Manufactureable Product List</span>
      </div>
    </template>
    <el-table :data="manuProducts" style="width: 100%">
      <el-table-column label="Product Name">
        <template #default="scope">
          {{ scope.row.product.name }}
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="editproduct(scope.row)"
            :disabled="adding"
          >
            Manufacture
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog v-model="dialogVisible" :title="'Manufacturing Product'" fullscreen width="100%">
    <el-form :model="make" label-width="auto" style="max-width: 99%">
      <el-form-item label="Quantity"
        ><el-input type="number" v-model="make.quantity" @input="inputchange()"
      /></el-form-item>
    </el-form>
    <h3 class="text-center">Required Item</h3>
    <el-table :data="make.items" style="width: 100%">
      <el-table-column label="Item Name" prop="product_name" />
      <el-table-column label="Quantity Per Unit">
        <template #default="scope">
          {{ scope.row.unit_quantity + ' ' + scope.row.product_unit }}
        </template>
      </el-table-column>
      <el-table-column label="Quantity In Stock">
        <template #default="scope">
          {{ scope.row.in_stock + ' ' + scope.row.product_unit }}
        </template>
      </el-table-column>
      <el-table-column label="Required Quantity">
        <template #default="scope">
          <span v-if="scope.row.high" class="bg-red-800"
            ><b>{{ scope.row.quantity + ' ' + scope.row.product_unit }}</b></span
          >
          <span v-else>{{ scope.row.quantity + ' ' + scope.row.product_unit }}</span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="manuProduct()" :disabled="is_high"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup></script>
<script lang="ts">
import { ElMessage } from 'element-plus'
import { getToManu, ManuProductComplete } from '@/api/manu'
export default {
  name: 'ChallanTransfer',
  data() {
    const manuProducts: any = []
    //const ruleFormRef = ref<FormInstance>()
    //const $refs: any = {}
    return {
      is_high: true,
      page_number: 1, //1='first',2='second',3='third',4='final'
      action_type: 0, //1=delivery, 2=receive, 0=view
      manuProducts,
      adding: false,
      dialogVisible: false,
      make: {
        product_uid: '',
        quantity: 0,
        product_name: '',
        unit: '',
        items: [
          {
            product_uid: '',
            product_name: '',
            product_unit: '',
            quantity: 0,
            unit_quantity: 0,
            in_stock: 0,
            high: false
          }
        ]
      }
    }
  },
  mounted() {
    this.getrequired()
  },
  updated() {},
  methods: {
    inputchange() {
      this.is_high = this.make.quantity < 1
      this.make.items.forEach((item: any) => {
        item.quantity = item.unit_quantity * this.make.quantity
        item.high = item.quantity > item.in_stock
        if (item.high) {
          this.is_high = true
        }
      })
    },
    getrequired() {
      return new Promise((resolve, reject) => {
        getToManu()
          .then((res: any) => {
            this.manuProducts = res.data
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    handleAdd() {},
    manuProduct() {
      this.inputchange()
      if (this.is_high) {
        ElMessage.error('Stock is Low')
        return
      }
      this.is_high = true
      ManuProductComplete(this.make)
        .then((res: any) => {
          ElMessage.success('Manufactured Successfully')
          this.manuProducts = res.data
          this.dialogVisible = false
        })
        .catch((err: string) => {
          this.is_high = false
          ElMessage.error('Cant Proceed! ' + err)
          err
        })
    },
    editproduct(product: any) {
      this.is_high = true
      this.make.product_uid = product.product_uid
      this.make.product_name = product.product.name
      this.make.unit = product.product.unit.unit
      this.make.quantity = 0
      this.make.items = []
      product.items.forEach((item: any) => {
        this.make.items.push({
          product_uid: item.product_uid,
          product_name: item.product.name,
          product_unit: item.product.unit.unit,
          quantity: 0,
          unit_quantity: item.quantity,
          in_stock: item.product.stock.quantity_good,
          high: false
        })
      })
      this.dialogVisible = true
      console.log('manufacture -> ', product, this.make)
    }
  }
}
</script>
<style scoped>
div_underline {
  border: 2px solid;
}
</style>
