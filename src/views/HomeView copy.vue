<template>
  <div class="w-full">
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
          <el-tag v-if="!scope.row.is_saleable" type="info" disable-transitions
            >Not For Sale</el-tag
          >
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

    <!-- Add Product -->
    <el-form
      v-if="current_job != 'show'"
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
    <div class="w-fit m-auto">
      <el-pagination
        v-if="current_job == 'show'"
        :background="true"
        :current-page="productPagination.current_page"
        :total="productPagination.total"
        layout="prev, pager, next"
      />
    </div>
    <div class="footer text-right align-bottom">
      <el-button
        v-if="current_job == 'add'"
        :disabled="activework"
        @click="insertproduct"
        type="success"
        class="m-2"
      >
        Add
      </el-button>
      <el-button
        v-if="current_job == 'edit'"
        :disabled="activework"
        @click="updateproduct"
        type="primary"
        class="m-2"
      >
        Update
      </el-button>
      <el-button
        v-if="current_job != 'show'"
        :disabled="activework"
        @click="canceledit"
        type="danger"
        class="m-2"
      >
        Cancel
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useMenuItemsStore } from '@/store/menuItems'
import { ref } from 'vue' //computed,
import { getProducts, insertProduct, updateProduct } from '@/api/product'
import { getUnits } from '@/api/unit'
import '@/functions/interfeces'
import type { FormInstance } from 'element-plus'

//const search = ref('')
</script>
<script lang="ts">
export default {
  data() {
    const showproducts: Product[] = []
    const products: Product[] = []
    const productPagination: any = {}
    const handleProduct: any = {}
    const productUnits: Unit[] = []
    const ruleFormRef = ref<FormInstance>()
    const $refs: any = {}
    return {
      activework: false,
      user_name: 'MFMALI',
      current_job: 'show', // show add edit
      show_table_loadding: true,
      searchintable: '',
      current_page: 1,
      ruleFormRef,
      products,
      showproducts,
      productPagination,
      handleProduct,
      productUnits,
      stocktableshow: true,
      count: 1,
      menustore: useMenuItemsStore(),
      allitems: useMenuItemsStore().$state.commonCat,
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
    this.getproducts()
    this.user_name = 'MFMALI'
    //console.log(this.user_name)
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
                this.current_job = 'show'
                this.getproducts(1)
                resolve(true)
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

      //this.current_job = 'show'
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
                  this.current_job = 'show'
                  this.getproducts(this.current_page, true)
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
      this.current_job = 'show'
    },
    getunits() {
      return new Promise((resolve, reject) => {
        getUnits()
          .then((res: { data: Unit[] }) => {
            this.productUnits = res.data
          })
          .catch((err: String) => {
            reject(false)
          })
      })
    },
    getproducts(page: number = 1, loaddingshow = true) {
      this.show_table_loadding = loaddingshow
      return new Promise((resolve, reject) => {
        getProducts(page)
          .then((res: any) => {
            //console.log(res)
            this.products = res.data.data
            this.productPagination = res.data
            this.filterTableData()
            this.show_table_loadding = false
          })
          .catch((err: string) => {
            console.log(err)
            reject(false)
          })
      })
    },
    handleAdd() {
      this.handleProduct = {}
      this.getunits()
      this.current_job = 'add'
    },
    clearobject(ob: any) {
      ob.array.forEach((key: any, value: any) => {
        ob[key] = null
      })
    },
    filterTableData() {
      this.showproducts = this.products.filter(
        (data) =>
          !this.searchintable || data.name.toLowerCase().includes(this.searchintable.toLowerCase())
      )
    },
    handleEdit(index: number, row: User) {
      this.getunits()
      this.current_job = 'edit'
      this.handleProduct = { ...row }
      //console.log(index, row)
    },
    handleDelete(index: number, row: User) {
      console.log(index, row)
    },
    gotostockledger(item_id: string | number) {
      this.$router.push({ name: 'StockLedgerView', params: { id: item_id } })
    },
    getstockdata() {},

    getDataFromStore() {
      var all = this.menustore.allCats
      this.allitems = all.map((cat) => {
        return {
          id: cat.id,
          name: cat.name,
          subCategories: cat.subCategories.map((sub) => {
            return {
              id: sub.id,
              name: sub.name,
              svg_name: '',
              products: sub.product_types.flatMap((pt) => {
                return pt.mostSoldTenProducts.flatMap((prod) => [prod])
              })
            }
          })
        }
      })
    },
    getSubProdThumb(subCatItem: subCategories_c) {
      //console.log(subCatItem)
      return [
        subCatItem.products[this.getHelpRand(subCatItem.products.length)],
        subCatItem.products[this.getHelpRand(subCatItem.products.length)],
        subCatItem.products[this.getHelpRand(subCatItem.products.length)],
        subCatItem.products[this.getHelpRand(subCatItem.products.length)]
      ]
    },
    getHelpRand(max: number) {
      return Math.floor(Math.random() * max)
    },
    scroolLeft(id: string, l: number) {
      //console.log('Go left of ' + id)
      let content = document.querySelector('#' + id)
      if (content) content.scrollLeft -= l
    },
    scroolRight(id: string, l: number) {
      //console.log('Go right of ' + id)
      let content = document.querySelector('#' + id)
      if (content) content.scrollLeft += l
    },
    gotoSubCatPage(sid: number) {
      this.$router.push({ name: 'CatagoryView', params: { id: sid } })
    }
  }
}
</script>
<style scoped>
.searchbar {
  height: var(--width-search);
  margin: auto;
  border: 2px solid var(--color-search);
  border-radius: 12px;
  padding: 0px 8px 0px 8px;
  min-width: 50%;
}
.searchbar .input {
  border: none;
  background-color: #ffffff00;
  height: 100%;
  width: calc(100% - 100px);
  font-size: 15px;
}
.searchbar .input:focus {
  border: none;
  background-color: #ffffff00;
  outline: none;
}
.searchbar .button {
  float: inline-end;
  position: relative;
  right: -10px;
  margin-top: -2px;
  height: calc(100% + 4px);
  border-radius: 12px;
  width: 100px;
}
.searchbar .button:hover {
  animation: flow 3s infinite;
  animation-timing-function: linear;
}
@keyframes flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100%;
    background-color: blue;
    color: white;
  }
  100% {
    background-position: 100%;
  }
}
.searchbar .button:active {
  background-color: green;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
td {
  text-align: center;
}
</style>
