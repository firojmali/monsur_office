<template>
  <div class="w-full bg-white mb-3 text-center size-16 text-green-900">
    History of {{ dataRecord.name }}
  </div>
  <el-table
    :data="table_data"
    v-loading="activework"
    style="max-width: 95%; margin: auto; margin-top: 2px; margin-bottom: 8px"
  >
    <el-table-column label="Date" width="120">
      <template #default="scope">
        {{ showdate(scope.row.date) }}
      </template>
    </el-table-column>
    <el-table-column label="Description" prop="description" />
    <el-table-column label="Challan Number" prop="challan_number" width="120" />
    <el-table-column label="Good Quantity" class="text-center">
      <el-table-column label="Delivery" width="90">
        <template #default="scope">
          <el-tag v-if="scope.row.good_d > 0" type="danger">{{ scope.row.good_d }}</el-tag>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column label="Receive" prop="good_r" width="90">
        <template #default="scope">
          <el-tag v-if="scope.row.good_r > 0" type="primary">{{ scope.row.good_r }}</el-tag>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column label="Balance" prop="good_b" width="90" />
    </el-table-column>
    <el-table-column label="Damaged Quantity" class="text-center">
      <el-table-column label="Delivery" prop="dam_d" width="90"
        ><template #default="scope">
          <el-tag v-if="scope.row.dam_d > 0" type="danger">{{ scope.row.dam_d }}</el-tag>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column label="Receive" prop="dam_r" width="90"
        ><template #default="scope">
          <el-tag v-if="scope.row.dam_r > 0" type="primary">{{ scope.row.dam_r }}</el-tag>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column label="Balance" prop="dam_b" width="90" />
    </el-table-column>
    <el-table-column label="Total Balance" prop="total_b" width="120" />
  </el-table>
  <el-button :disabled="activework" @click="emitclose()" type="danger" class="m-2">
    Close
  </el-button>
</template>
<script lang="ts" setup>
import { stockChallans } from '@/api/stock'
import moment from 'moment'
</script>
<script lang="ts">
export default {
  name: 'ShowStockChallan',
  emits: ['close'],
  props: {
    dataRecord: {
      type: Object,
      default() {
        return {
          product_uid: null,
          from: null,
          to: null,
          opening_good: 0,
          opening_damaged: 0,
          good_quantity: 0,
          damaged_quantity: 0,
          name: ''
        }
      }
    }
  },
  data() {
    const handleChallan: any = []
    return {
      is_ready: false,
      activework: false,
      handleChallan,
      showdata: { data: this.dataRecord, challans: handleChallan },
      table_data: [
        {
          date: null,
          challan_number: '',
          description: '',
          good_d: 0,
          good_r: 0,
          good_b: 0,
          dam_d: 0,
          dam_r: 0,
          dam_b: 0,
          total_b: 0,
          entry_by: '',
          remarks: ''
        }
      ]
    }
  },
  mounted() {
    console.log(this.dataRecord)
    if (this.dataRecord.product_uid && this.dataRecord.product_uid != null)
      this.getChallans(this.dataRecord)
  },
  updated() {},
  methods: {
    showdate(dt: string) {
      console.log('gotdt=', dt)
      return moment(dt).format('DD-MM-YYYY')
    },
    generateData() {
      let good_d = 0,
        good_b = 0,
        good_r = 0,
        dam_d = 0,
        dam_b = 0,
        dam_r = 0,
        total_b = 0
      good_b = this.dataRecord.opening_good
      dam_b = this.dataRecord.opening_damaged
      total_b = this.dataRecord.opening_good + this.dataRecord.opening_damaged
      this.table_data = []
      this.table_data.push({
        date: this.dataRecord.from,
        challan_number: '',
        description: 'Opening Balance',
        good_d: 0,
        good_r: 0,
        good_b: good_b,
        dam_d: 0,
        dam_r: 0,
        dam_b: dam_b,
        total_b: total_b,
        entry_by: '',
        remarks: ''
      })

      this.showdata.challans.forEach((chalan: any) => {
        const gd = chalan.is_in ? 0 : chalan.quantity_good
        const gr = chalan.is_in ? chalan.quantity_good : 0
        const bd = chalan.is_in ? 0 : chalan.quantity_damaged
        const br = chalan.is_in ? chalan.quantity_damaged : 0
        good_d = gd + good_d
        good_r = gr + good_r
        good_b = good_b - gd + gr
        dam_d = bd + dam_d
        dam_r = br + dam_r
        dam_b = dam_b - bd + br
        total_b = good_b + dam_b
        this.table_data.push({
          date: chalan.created_at,
          challan_number: chalan.challan.challan_number,
          description: chalan.is_in
            ? 'Received From ' + chalan.challan.party
            : 'Delivery To ' + chalan.challan.party,
          good_d: gd,
          good_r: gr,
          good_b: good_b,
          dam_d: bd,
          dam_r: br,
          dam_b: dam_b,
          total_b: total_b,
          entry_by: '',
          remarks: chalan.remarks
        })
      })
      this.table_data.push({
        date: null,
        description: '-----Balance----',
        challan_number: '',
        good_d: 0,
        good_r: 0,
        good_b: this.dataRecord.good_quantity,
        dam_d: 0,
        dam_r: 0,
        dam_b: this.dataRecord.damaged_quantity,
        total_b: this.dataRecord.good_quantity + this.dataRecord.damaged_quantity,
        entry_by: '',
        remarks: ''
      })
    },
    emitclose() {
      this.$emit('close')
    },
    getChallans(data: any) {
      this.activework = true
      return new Promise((resolve, reject) => {
        stockChallans(data)
          .then((res: any) => {
            this.showdata.challans = res.data
            this.showdata.data = data
            this.generateData()
            this.activework = false
            res
          })
          .catch((err: string) => {
            reject(false)
            this.activework = false
            err
          })
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
</style>
