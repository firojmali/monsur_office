<template>
  <el-table :data="divisionList">
    <el-table-column label="code" prop="code" />
    <el-table-column label="bn_name" prop="bn_name" />
    <el-table-column label="en_name" prop="en_name" />
  </el-table>
  <el-button @click="getsetdistricts()">Ger Dist</el-button>
</template>
<script lang="ts" setup></script>
<script lang="ts">
import {
  getDistrictsBD,
  getDistrictsEN,
  getDistricts,
  setDivisions,
  getDivisions,
  setDistricts
} from '@/api/bd'

export default {
  name: 'DoTo',
  data() {
    const districtList: any = {}
    return {
      divisions_bn:
        '<option value="" selected="">বিভাগ বাছাই করুন</option><option value="68">ঢাকা</option><option value="36">চট্টগ্রাম</option><option value="60">রাজশাহী</option><option value="65">খুলনা</option><option value="66">বরিশাল</option><option value="69">রংপুর</option><option value="67">সিলেট</option><option value="6175">ময়মনসিংহ</option>"',
      divisions_en:
        '<option value="" selected="">Select Division</option><option value="68">Dhaka</option><option value="36">Chattogram</option><option value="60">Rajshahi</option><option value="65">Khulna</option><option value="66">Barishal</option><option value="69">Rangpur</option><option value="67">Sylhet</option><option value="6175">Mymensingh</option>',
      divisionList: [{ code: 1, bn_name: '', en_name: '' }],
      all: false,
      total: 0,
      now: 0,
      districtList,
      en_v: '',
      bn_v: ''
    }
  },
  mounted() {
    this.getdiviosns()
  },
  updated() {},
  methods: {
    getdiviosns() {
      return new Promise((resolve, reject) => {
        getDivisions()
          .then((res: any) => {
            console.log(res.data)
            this.divisionList = res.data
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    getsetdistricts() {
      if (this.now < this.divisionList.length) {
        let data = new FormData()
        data.append('parent', String(this.divisionList[this.now].code))
        data.append('domain_type', 'District')
        this.getDistrictsFromBD(data)
      }
    },
    getDistrictsFromBD(data: FormData) {
      return new Promise((resolve, reject) => {
        getDistrictsEN(data)
          .then((res: any) => {
            console.log(res)
            this.bn_v = res
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    getDistrictsFromBDEN(data: FormData) {
      return new Promise((resolve, reject) => {
        getDistrictsBD(data)
          .then((res: any) => {
            console.log(res)
            this.en_v = res
          })
          .catch((err: string) => {
            reject(false)
            err
          })
      })
    },
    divisions() {
      let ids = this.divisions_bn.split('"')
      let take = 0
      let divid = 0
      let divl: any = []
      let hlp = ''
      ids.forEach((idk: string) => {
        if (parseInt(idk) > 0) {
          take = 1
          divid = parseInt(idk)
        } else if (take) {
          take = 0
          hlp = idk.substring(idk.indexOf('>') + 1, idk.indexOf('</'))
          divl.push({ code: divid, bn_name: hlp })
        }
      })

      let divh: any = []
      ids = this.divisions_en.split('"')
      ids.forEach((idk: string) => {
        if (parseInt(idk) > 0) {
          take = 1
          divid = parseInt(idk)
        } else if (take) {
          take = 0
          hlp = idk.substring(idk.indexOf('>') + 1, idk.indexOf('</'))
          divl.forEach((div: any) => {
            if (div.code == divid) {
              divh.push({ ...div, en_name: hlp })
            }
          })
          divl.push({ code: divid, bn_name: hlp })
        }
      })
      console.log(divh)
      this.divisionList = divh
      return ids
    }
  }
}
</script>
<style scoped>
div_underline {
  border: 2px solid;
}
</style>
