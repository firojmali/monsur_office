<template>
  <!-- First Page Select Type -->
  <template v-if="page_number == 1">
    <el-card style="width: 480px; margin: auto" shadow="always">
      <el-button type="primary" :loadding="wait" @click="operate_page_1(1)"
        >Delivery Challan</el-button
      >
      <el-button type="success" :loadding="wait" @click="operate_page_1(2)"
        >Receive Product</el-button
      >
      <el-button type="info" :loadding="wait" @click="operate_page_1(0)">Veiw Challan</el-button>
    </el-card>
  </template>
  <!-- Second Page Input Description -->
  <template v-if="page_number == 2">
    <!--  for View Type in Second Page Input Description -->
    <el-card v-if="action_type == 0" style="width: 480px; margin: auto" shadow="always">
      <el-select v-model="challanNumber" placeholder="Select" style="width: 100%">
        <el-option
          v-for="item in existedChallan"
          :key="item.id"
          :label="getchallaninfo(item)"
          :value="item.uid"
          :disabled="false"
        />
      </el-select>
    </el-card>

    <!--  for Not View Type in Second Page Input Description -->
    <el-card v-if="action_type != 0" style="width: 480px; margin: auto" shadow="always">
      <div class="text-center w-full">
        Active Date: {{ getdateonly(challanMain.active_date_time) }}
      </div>
      <h class="text-center"
        >Challan {{ challanMain.is_in == 1 ? 'Delivery To ' : 'Receive From' }}
        <span v-if="challanMainFeild.party" class="text-red-600">
          * {{ challanMainFeild.partydata }}</span
        ></h
      ><br />
      <el-input
        v-model="challanMain.party"
        style="width: 240px"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="Company / personal details"
      />
    </el-card>
    <el-card v-if="action_type != 0" style="width: 480px; margin: auto" shadow="always">
      <h class="text-center"
        >Challan Number
        <span v-if="challanMainFeild.challan_number" class="text-red-600">
          * {{ challanMainFeild.challan_number_data }}</span
        > </h
      ><br />
      <el-input
        v-model="challanMain.challan_number"
        style="width: 240px"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="text"
        placeholder="Input Challan Number"
      />
    </el-card>
    <el-card v-if="action_type != 0" style="width: 480px; margin: auto" shadow="always">
      <h class="text-center"
        >Challan Date
        <span v-if="challanMainFeild.challan_date" class="text-red-600">
          * {{ challanMainFeild.challan_date_data }}</span
        > </h
      ><br />
      <el-date-picker v-model="challanMain.challan_date" type="date" placeholder="Pick a day" />
    </el-card>
    <el-card v-if="action_type != 0" style="width: 480px; margin: auto" shadow="always">
      <h class="text-center">Remarks</h><br />
      <el-input
        v-model="challanMain.remarks"
        style="width: 240px"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="Any Remarks"
      />
    </el-card>
    <div class="relative right-0 w-full p-4 text-right">
      <el-button class="m-3" type="primary" @click="operate_page_2()">Next</el-button>
      <el-button class="m-3" type="danger" @click="page_number = 1">Close</el-button>
    </div>
  </template>
  <template v-if="page_number == 3">
    <!--  for View Type in Second Page Input Description -->
    <el-card v-if="action_type == 0" style="width: 480px; margin: auto" shadow="always">
      show challan of UID = {{ challanNumber }}
    </el-card>
    <el-card v-else style="width: 480px; margin: auto" shadow="always">
      <div>
        <h3 class="text-center size-6 text-green-600 w-full">
          {{ challanMain.is_in ? 'RECEIVING CHALLAN' : 'DELIVERY CHALLAN' }}
        </h3>
        <h3 class="text-center size-5 text-fuchsia-800 w-full">
          <u>Challan: {{ challanMain.challan_number }}</u>
        </h3>
        <div class="w-full inline-block">
          <div class="float-left">
            {{ challanMain.is_in ? 'From,' : 'To,' }}<br />
            <span class="ml-2">{{ challanMain.party }}</span>
          </div>
          <div class="float-right">
            Dated: {{ getdateonly(challanMain.challan_date) }}<br />Entry Date:
            {{ getdateonly(challanMain.active_date_time) }}
          </div>
        </div>
        <div class="w-full inline-block text-center">
          [ <span class="text-blue-800"> Note:</span> {{ challanMain.remarks }} ]
        </div>
      </div>
      <div class="w-full inline-block text-right">
        <el-button class="m-3" type="success" :icon="Plus" @click="addproductclicked()"
          >Add Product</el-button
        >
      </div>
      <el-table v-if="challanproducts.length" :data="challanproducts">
        <el-table-column label="Name" sortable prop="name" />
        <el-table-column label="Good Quantity">
          <template #default="scope">{{ scope.row.quantity_good }} {{ scope.row.unit }}</template>
        </el-table-column>
        <el-table-column label="Damaged Quantity">
          <template #default="scope"
            >{{ scope.row.quantity_damaged }} {{ scope.row.unit }}</template
          >
        </el-table-column>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="editchallancliked(scope.row)"> Edit </el-button>
            <el-button size="small" type="danger" @click="deletefromchallanlist(scope.row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="relative right-0 w-full p-4 text-right">
        <el-button
          v-if="challanproducts.length"
          class="m-3"
          type="primary"
          @click="operate_page_3()"
          >Next</el-button
        >
        <el-button class="m-3" type="danger" @click="page_number = 1">Close</el-button>
      </div>
    </el-card>
  </template>

  <!-- dialog Adding Product in challan-->
  <el-dialog v-model="dialogvisible" :show-close="false" :fullscreen="true">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">Select Product and input quantity</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </div>
    </template>
    <el-card style="width: 480px; margin: auto" shadow="always">
      <el-select
        v-if="dialogFor == 'Add'"
        filterable
        v-model="productselected.product_uid"
        clearable
        placeholder="Select"
        style="width: 240px"
        @change="getunit()"
      >
        <el-option
          v-for="item in selectfromproducts"
          :key="item.id"
          :label="item.name"
          :value="item.uid"
        />
      </el-select>
      <div v-else class="w-full text-center">
        {{ productselected.name }}
      </div>
      <div v-if="productselected.product_uid && productselected.product_uid != ''">
        <br />Good Quantity<br />
        <el-input-number v-model="productselected.quantity_good">
          <template #suffix>
            <span>{{ productselected.unit }}</span>
          </template>
        </el-input-number>
        <span class="text-blue-800 font-bold" :class="{ 'text-red-800': stock_good_excede }"
          >In Stock: {{ productselected.stock_good }} {{ productselected.unit }}</span
        >
        <br />Damaged Quantity<br />
        <el-input-number v-model="productselected.quantity_damaged">
          <template #suffix>
            <span>{{ productselected.unit }}</span>
          </template>
        </el-input-number>
        <span class="text-blue-800 font-bold" :class="{ 'text-red-800': stock_bad_excede }"
          >In Stock: {{ productselected.stock_bad }} {{ productselected.unit }}</span
        >
      </div>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogclose()">Cancel</el-button>
        <el-button
          v-if="productselected.quantity_damaged > 0 || productselected.quantity_good > 0"
          type="primary"
          @click="addtochallanlist()"
        >
          {{ dialogFor }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <template v-if="page_number == 4">
    <!--  for View Type in Second Page Input Description -->
    <el-card
      v-if="action_type == 0 && !challangot"
      style="width: 480px; margin: auto"
      shadow="always"
    >
      Wait ... loadding show challan of UID = {{ challanNumber }}
    </el-card>
    <el-card v-else style="width: 700px; margin: auto" shadow="always">
      <p class="w-full text-center">CHALLAN</p>
      <div class="w-full inline-block">
        <div class="float-left">
          <el-table
            :border="false"
            :fit="true"
            :stripe="false"
            :show-header="false"
            style="width: 300px"
            :data="[
              { a: challan.is_in ? 'From,' : 'To,', b: '' },
              { a: '', b: challan.party }
            ]"
          >
            <el-table-column label=" " prop="a" /><el-table-column
              class="text-left w-full"
              label=" "
              prop="b"
            />
          </el-table>

          <div class="w-full inline-block text-center">
            [ <span class="text-blue-800"> Note:</span> {{ challan.remarks }} ]
          </div>
        </div>
        <div class="float-right">
          <el-table
            :border="false"
            :fit="true"
            :stripe="false"
            :show-header="false"
            style="width: 350px"
            cell-class-name="max-w-fit p-0 m-0"
            :data="[
              { a: 'Challan Number', b: challan.challan_number, c: ':' },
              { a: 'Challan Date', b: getdateonly(challan.challan_date), c: ':' },
              { a: 'Entry Date', b: getdateonly(challan.active_date_time, action_type), c: ':' }
            ]"
          >
            <el-table-column style="width: fit-content" label=" " prop="a" />
            <el-table-column label=" " prop="c" />
            <el-table-column label=" " prop="b" />
          </el-table>
        </div>
      </div>
      <br />
      <div class="text-center size-6 text-green-600 w-full pb-2 div_underline">
        {{ challanMain.is_in ? 'RECEIVING CHALLAN' : 'DELIVERY CHALLAN' }}
      </div>
      <br />
      <el-table :data="challan.challan_items">
        <el-table-column v-if="action_type" label="Name" sortable prop="name" />
        <el-table-column v-else label="Name" sortable>
          <template #default="scope">{{
            scope.row.product.type + ': ' + scope.row.product.name
          }}</template>
        </el-table-column>
        <el-table-column label="total Quantity">
          <template #default="scope"
            >{{ scope.row.quantity_good + scope.row.quantity_damaged }}
            {{ scope.row.unit }}</template
          >
        </el-table-column>
        <el-table-column label="Good Quantity">
          <template #default="scope">{{ scope.row.quantity_good }} {{ scope.row.unit }}</template>
        </el-table-column>
        <el-table-column label="Damaged Quantity">
          <template #default="scope"
            ><span v-if="scope.row.quantity_damaged" class="text-red-950"
              >{{ scope.row.quantity_damaged }} {{ scope.row.unit }}</span
            ><span v-else>__</span></template
          >
        </el-table-column>
      </el-table>
      <div v-if="!wait" class="relative right-0 w-full p-4 text-right">
        <el-button v-if="action_type" class="m-3" type="primary" @click="InsertChallan()"
          >Insert</el-button
        >
        <el-button v-if="action_type" class="m-3" type="success" @click="page_number = 3"
          >Back</el-button
        >
        <el-button class="m-3" type="danger" @click="page_number = 1">{{
          action_type ? 'Cancel' : 'Close'
        }}</el-button>
      </div>
    </el-card>
  </template>
</template>
<script lang="ts" setup></script>
<script lang="ts">
import { getProducts } from '@/api/product'
import { insertChallan, getChallans, getChallan } from '@/api/challan'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import moment from 'moment'
import { Plus } from '@element-plus/icons-vue'
export default {
  name: 'ChallanTransfer',
  data() {
    const products: any = {}
    const productUnits: Unit[] = []
    const existedChallan: any = []
    const challanproducts: any = []
    const selectfromproducts: any = []
    const challan: any = {}
    const challanMainFeild: any = {}
    const stockchallans: any = []
    //const ruleFormRef = ref<FormInstance>()
    //const $refs: any = {}
    return {
      page_number: 1, //1='first',2='second',3='third',4='final'
      action_type: 0, //1=delivery, 2=receive, 0=view
      products,
      challan,
      productUnits,
      challanMainFeild,
      stockchallans,
      wait: true,
      dialogFor: 'edit',
      challangot: false,
      challanNumber: '',
      dialogvisible: false,
      selectfromproducts,
      existedChallan,
      challanproducts,
      stock_good_excede: false,
      stock_bad_excede: false,
      challanMain: {
        id: null,
        is_in: 0,
        party: '',
        challan_number: '',
        challan_date: ref(''),
        active_date_time: ref(''),
        remarks: ''
      },
      productselected: {
        is_in: 0,
        name: '',
        product_uid: '',
        quantity_good: 0,
        quantity_damaged: 0,
        challan_uid: '',
        active_date_time: '',
        remarks: '',
        unit: '',
        stock_good: 0,
        stock_bad: 0
      },
      blank_date_ref: ref(''),
      rules: {
        type: [{ required: true, message: 'Please select at the product type', trigger: 'change' }],
        name: [
          { required: true, message: "Please input Product's name", trigger: 'blur' },
          { min: 3, message: ' Name Should be minimum 3 Charecter', trigger: 'blur' }
        ],
        description: [
          { required: false, message: "Please input Product's Description", trigger: 'blur' },
          { min: 5, message: ' Description Should be minimum 6 Charecter', trigger: 'blur' }
        ],
        is_saleable: [{ required: true, message: 'Please select One', trigger: 'blur' }],
        is_complete: [{ required: true, message: 'Please select One', trigger: 'blur' }],
        unit_uid: [{ required: true, message: 'Please select Unit', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getproducts()
    this.existedChallan = [
      { id: 1, uid: 'sadf', is_in: null, challan_number: '87y789y79', challan_date: '12/5/24' },
      { id: 2, uid: 'sadfsd', is_in: 1, challan_number: '554789y79', challan_date: '12/6/24' }
    ]
  },
  updated() {},
  methods: {
    InsertChallan() {
      const challan = {
        ...this.challan
      }
      const plus = challan.is_in ? 1 : 0
      const minus = challan.is_in ? 0 : 1
      let stock_update_v: any = []
      let challan_items_v: any = []
      let challan_v = {
        is_in: challan.is_in,
        party: challan.party,
        challan_number: challan.challan_number,
        challan_date: this.tosqldate(challan.challan_date),
        active_date_time: this.toymdhms(),
        remarks: challan.remarks
      }
      //let total = 0
      challan.challan_items.forEach((item: any) => {
        challan_items_v.push({
          is_in: item.is_in,
          product_uid: item.product_uid,
          quantity_good: item.quantity_good,
          quantity_damaged: item.quantity_damaged,
          active_date_time: this.toymdhms(),
          remarks: item.remarks
        })
        stock_update_v.push({
          product_uid: item.product_uid,
          quantity_damaged_plus: plus * item.quantity_damaged,
          quantity_good_plus: plus * item.quantity_good,
          quantity_damaged_minus: minus * item.quantity_damaged,
          quantity_good_minus: minus * item.quantity_good
        })
      })
      const stock_update = [...stock_update_v]
      const challan_insert = { ...challan_v, challan_items: [...challan_items_v] }
      const data = { challan_insert: challan_insert, stock_update: stock_update }

      this.wait = true
      return new Promise((resolve, reject) => {
        insertChallan(data)
          .then((res: any) => {
            if (res.data.error) {
              //massage error
              ElMessage.error(res.data.msg)

              this.wait = false
            } else {
              this.wait = false
              this.getproducts()
              this.page_number = 1
              res.data.msg
            }
          })
          .catch((err: string) => {
            this.wait = false
            reject(false)
            err
          })
      })
    },
    tosqldate(d: string) {
      return moment(d).format('YYYY-MM-DD')
    },
    toymdhms() {
      const a = moment()
      let ay = a.year()
      let am = a.month() + 1
      let ad = a.date()
      return ay * 10000 + am * 100 + ad
    },
    operate_page_3() {
      this.challan = { ...this.challanMain }
      this.challan.challan_items = [...this.challanproducts]
      this.page_number = 4
    },
    addtochallanlist() {
      this.stock_bad_excede = false
      this.stock_good_excede = false
      if (!this.challanMain.is_in) {
        if (this.productselected.quantity_damaged > this.productselected.stock_bad)
          this.stock_bad_excede = true
        else this.stock_bad_excede = false
        if (this.productselected.quantity_good > this.productselected.stock_good)
          this.stock_good_excede = true
        else this.stock_good_excede = false
      }
      if (
        this.productselected.product_uid &&
        this.productselected.quantity_damaged + this.productselected.quantity_good <= 0
      )
        return
      if (this.stock_bad_excede || this.stock_good_excede) return

      let prev_entry = false
      this.challanproducts.forEach((prod: any, key: string) => {
        if (prod.product_uid == this.productselected.product_uid) {
          this.challanproducts[key] = { ...this.productselected }
          prev_entry = true
        }
      })
      if (!prev_entry) this.challanproducts.push({ ...this.productselected })
      this.dialogclose()
    },
    deletefromchallanlist(row: any) {
      this.challanproducts.splice(this.challanproducts.indexOf(row), 1)
    },
    getunit() {
      this.stock_bad_excede = false
      this.stock_good_excede = false
      this.products.forEach((prod: any) => {
        if (prod.uid == this.productselected.product_uid) {
          this.productselected.unit = prod.unit.unit
          this.productselected.stock_good = prod.stock.quantity_good
          this.productselected.stock_bad = prod.stock.quantity_damaged
          this.productselected.name = prod.type + ': ' + prod.name
        }
      })
    },
    getdateonly(dt: any, is_formated: number = 1) {
      if (!is_formated) {
        return moment(dt, 'YYYYMMDD').format('DD-MM-YYYY')
      }
      return moment(dt).format('DD-MM-YYYY')
    },
    operate_page_2() {
      this.challangot = true
      console.log('sdfasdfsf', this.challanMain)
      if (!this.action_type) {
        this.challangot = false
        this.getchallan()
        this.page_number = 4
        return
      }
      let valid = true
      if (this.challanMain.party.length < 6) {
        this.challanMainFeild.party = true
        valid = false
      }
      if (this.challanMain.challan_number.length < 1) {
        this.challanMainFeild.challan_number = true
        valid = false
      }
      if (this.challanMain.challan_date.length < 6) {
        this.challanMainFeild.challan_date = true
        valid = false
      }
      if (!valid) return
      this.challanproducts = []
      this.page_number = 3
    },
    addproductclicked() {
      this.stock_bad_excede = false
      this.stock_good_excede = false
      this.productselected = {
        is_in: this.challanMain.is_in,
        name: '',
        product_uid: '',
        quantity_good: 0,
        quantity_damaged: 0,
        challan_uid: '',
        active_date_time: this.challanMain.active_date_time,
        remarks: '',
        unit: '',
        stock_bad: 0,
        stock_good: 0
      }
      let help_var: boolean = false
      this.selectfromproducts = this.products.filter((prod: any) => {
        help_var = true
        if (!prod.stock) return false
        if (prod.stock.quantity_damaged == null || prod.stock.quantity_good == null) return false
        this.challanproducts.forEach((cprod: any) => {
          if (cprod.product_uid == prod.uid) help_var = false
        })
        return help_var
      })
      this.dialogFor = 'Add'
      this.dialogvisible = true
    },
    editchallancliked(row: any) {
      this.stock_bad_excede = false
      this.stock_good_excede = false
      this.productselected = { ...row }
      this.selectfromproducts = [{ ...row }]
      this.dialogFor = 'Update'
      this.dialogvisible = true
    },
    dialogclose() {
      this.dialogvisible = false
    },
    getchallaninfo(item: any = {}) {
      const x = item.is_in ? 'R-' : 'D-'
      return x + item.challan_number + ' Dated: ' + item.challan_date
    },
    operate_page_1(type: number) {
      this.action_type = type
      if (!this.action_type) {
        this.getchallans()
        this.page_number = 2
        return
      }
      this.challanMain = {
        id: null,
        is_in: type == 1 ? 0 : 1,
        party: '',
        challan_number: '',
        challan_date: moment().format('MM-DD-YYYY'), //this.blank_date_ref,
        active_date_time: moment().format('MM-DD-YYYY'),
        remarks: ''
      }
      this.challanMainFeild = {
        party: false,
        partydata: 'Minimum 6 Charechter',
        challan_number: false,
        challan_number_data: 'Required',
        challan_date: false,
        challan_date_data: 'Required'
      }
      this.page_number = 2
    },
    getproducts() {
      return new Promise((resolve, reject) => {
        getProducts('allWS')
          .then((res: any) => {
            this.products = res.data
            this.wait = false
            this.getchallans()
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    getchallans() {
      return new Promise((resolve, reject) => {
        getChallans('all')
          .then((res: any) => {
            this.existedChallan = res.data
          })
          .catch((err: string) => {
            reject(false)

            err
          })
      })
    },
    getchallan() {
      return new Promise((resolve, reject) => {
        getChallan(this.challanNumber)
          .then((res: any) => {
            this.makechallantodisplay(res.data)
            this.challangot = true
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    makechallantodisplay(challandata: any) {
      this.challan = { ...challandata }
      //console.log(challandata, this.challan)
    }
  }
}
</script>
<style scoped>
div_underline {
  border: 2px solid;
}
</style>
