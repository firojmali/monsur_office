<template>
  <div v-if="is_ready">
    <!-- Add Product -->
    <el-form
      v-if="is_ready"
      ref="ruleFormRef"
      :model="handleProduct"
      :rules="rules"
      label-width="auto"
      label-position="top"
      class="w-full flex mt-8"
      status-icon
    >
      <div class="w-2/3 m-1">
        <el-card class="p-2 shadow-xl w-full" shadow="always">
          <el-form-item label="Product Type" prop="type">
            <el-select
              v-model="handleProduct.type"
              clearable
              placeholder="Select"
              style="width: 240px"
            >
              <el-option v-for="item in productTypes" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="Product name" prop="name">
            <el-input v-model="handleProduct.name" />
          </el-form-item>
        </el-card>

        <el-card class="p-2 shadow-xl w-full" shadow="always">
          <el-form-item label="Product Description" prop="description">
            <el-input
              v-model="handleProduct.description"
              :autosize="{ minRows: 2 }"
              type="textarea"
              placeholder="Select Type"
              class="w-full"
            >
            </el-input>
          </el-form-item>
        </el-card>
      </div>
      <div class="w-1/3 m-1">
        <el-card class="p-2 shadow-xl w-full" shadow="always">
          <el-form-item label="Product Counting Unit" prop="unit_uid">
            <el-select
              v-model="handleProduct.unit_uid"
              clearable
              placeholder="Select Unit"
              style="width: 100%"
            >
              <el-option
                v-for="item in productUnits"
                :key="item.uid"
                :label="item.unit"
                :value="item.uid"
              />
            </el-select>
          </el-form-item>
        </el-card>
        <el-card class="p-2 shadow-xl w-full" shadow="always">
          <el-form-item label="Will your company sale this item?" prop="is_saleable">
            <el-select
              v-model="handleProduct.is_saleable"
              clearable
              placeholder="Select"
              style="width: 100%"
            >
              <el-option label="Yes" value="1" />
              <el-option label="No" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="Is this item used to Manufature another product?" prop="is_complete">
            <el-select
              v-model="handleProduct.is_complete"
              clearable
              placeholder="Select"
              style="width: 100%"
            >
              <el-option label="Yes" value="0" />
              <el-option label="No" value="1" />
            </el-select>
          </el-form-item>
        </el-card>
      </div>
    </el-form>

    <!--footer for addremove-->
    <div class="footer text-right align-bottom">
      <el-button
        v-if="current_job2 == 'add'"
        :disabled="activework"
        @click="insertproduct"
        type="success"
        class="m-2"
      >
        Add
      </el-button>
      <el-button
        v-if="current_job2 == 'edit'"
        :disabled="activework"
        @click="updateproduct"
        type="primary"
        class="m-2"
      >
        Update
      </el-button>
      <el-button :disabled="activework" @click="canceledit" type="danger" class="m-2">
        Cancel
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserItemStore } from '@/store/userItem'
//import { ref } from 'vue' //computed,
import { insertProduct, updateProduct } from '@/api/product'
import { getUnits } from '@/api/unit'
//import '@/functions/interfeces'
//import type { FormInstance } from 'element-plus'

//const search = ref('')
</script>
<script lang="ts">
export default {
  name: 'AddEditProduct',
  emits: ['cancel', 'done'],
  props: {
    dataRecord: {
      type: Object,
      default() {
        return { current_job: 'add', rowValue: {} }
      }
    }
  },
  data() {
    const handleProduct: any = {}
    const productUnits: Unit[] = []
    //const ruleFormRef = ref<FormInstance>()
    const $refs: any = {}
    return {
      is_ready: false,
      activework: false,
      user_name: '',
      current_job2: 'show', // show add edit
      //ruleFormRef,
      handleProduct,
      productUnits,
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
      ],
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
    //console.log('datagor', this.dataRecord, this.dataRecord.current_job, this.dataRecord.rowValue)
    this.handleProduct = { ...this.dataRecord.rowValue }
    this.current_job2 = this.dataRecord.current_job
    this.getunits()
    const userStore = useUserItemStore()
    this.user_name = userStore.$state.user ? userStore.$state.user.name : ''
    //console.log('beready now')
    this.is_ready = true
  },
  updated() {},
  methods: {
    insertproduct() {
      console.log('product=', this.handleProduct)
      let self: any = this
      self.$refs.ruleFormRef.validate((valid: any, feilds: any) => {
        if (valid) {
          this.handleProduct.entry_by = this.user_name
          this.activework = true
          new Promise((resolve, reject) => {
            insertProduct(this.handleProduct)
              .then((res: any) => {
                this.activework = false
                this.$emit('done')
                resolve(true)
                res
              })
              .catch((err: string) => {
                this.activework = false
                reject(false)
                err
              })
          })
          console.log('submit')
        } else {
          console.log('invalid', feilds)
        }
      })

      //this.current_job2 = 'show'
      //this.getproducts(1, true)
    },
    updateproduct() {
      let self: any = this
      self.$refs.ruleFormRef.validate((valid: any, feilds: any) => {
        if (valid) {
          this.handleProduct.add_change_name = this.user_name
          this.activework = true
          new Promise((resolve, reject) => {
            updateProduct(this.handleProduct.uid, this.handleProduct)
              .then((res: any) => {
                this.activework = false
                if (res.code == 20000) {
                  this.$emit('done')
                  resolve(true)
                } else {
                  resolve(false)
                }
              })
              .catch((err: string) => {
                this.activework = false
                reject(false)
                console.log(err)
              })
          })
          console.log('submit')
        } else {
          console.log('invalid', feilds)
        }
      })
    },
    canceledit() {
      this.$emit('cancel')
      console.log('emit cancel')
    },
    getunits() {
      return new Promise((resolve, reject) => {
        getUnits()
          .then((res: { data: Unit[] }) => {
            this.productUnits = res.data
          })
          .catch((err: String) => {
            reject(false)
            err = ''
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
