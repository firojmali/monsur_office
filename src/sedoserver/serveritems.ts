import '@/functions/interfeces'
const serverdata = {
  data() {
    return {
      cats: 0
    }
  },
  methods: {
    sedoimageurl() {
      return [
        'https://s.alicdn.com/@sc04/kf/Ha818056626754fbfb8de5e1b4f784357Q.jpg_720x720q50.jpg',
        'https://s.alicdn.com/@sc04/kf/H228190d873b84e718341545689ef76ddK.png_64x64.jpg',
        'https://s.alicdn.com/@sc04/kf/He3accd44ba4d48db8926485962c27a959.jpg_100x100xz.jpg',
        'https://s.alicdn.com/@sc04/kf/H138c184cb5de431cb2f0ed454c6717a1R.png_64x64.jpg',
        'https://s.alicdn.com/@sc04/kf/H4c89b29a916340f9bddc761532ee178es.png_64x64.jp',
        'https://s.alicdn.com/@sc04/kf/H40326cd9ec4c4aee864722feefa953e6O.png_64x64.jpg'
      ]
    },
    getmenuitems() {},
    createProducts(page = 1, limit = 20) {
      if (!page) {
        page = 1
      }
      limit = 10 * parseInt(String(limit / 10))
      if (limit < 10) {
        limit = 10
      }
      let i = 0
      const limit2 = limit / 10
      let products: product[] = []
      while (i < 10) {
        products.push(...this.getproductsoftype(i, page, limit2))
        i++
      }
      products = products
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
      return products
    },
    getproductsoftype(type_id: number, page = 1, limit = 20) {
      if (type_id == 0) {
        type_id = 1000
      }
      if (!page) {
        page = 1
      }
      if (!limit) {
        limit = 20
      }
      const msl = []
      let mslc = (page - 1) * limit + 1
      const lastid = mslc + limit - 1
      const sid = Math.floor(Math.random() * 7)
      const cid = Math.floor(Math.random() * 7)
      while (mslc <= lastid) {
        msl.push({
          ...this.createaproduct(mslc, sid, cid),
          product_type_id: type_id
        })
        mslc++
      }
      return msl
    },
    createaproduct(pid: number, sid = 1, cid = 1) {
      const rnm = Math.floor(Math.random() * this.sedoimageurl().length)
      return {
        id: pid,
        name: 'product Name:' + pid,
        thumbnail: this.sedoimageurl()[rnm],
        prices: [
          { quantity: 100, unit: 'pcs', price: 1000 },
          { quantity: 30, unit: 'pcs', price: 350 },
          { quantity: 10, unit: 'pcs', price: 150 },
          { quantity: 1, unit: 'pcs', price: 15 }
        ],
        images: '["1315.png", "1213.png", "11.png" ]',
        sub_catagory: {
          id: sid,
          name: 'sub_category_' + sid,
          catagory: {
            id: cid,
            name: 'category_' + cid
          }
        },
        product_type_id: 12
      }
    },
    createDummyData() {
      // var sedoimages = this.sedoimageurl
      // var totalimages = sedoimages.length
      let i = 0,
        j = 0,
        k = 0
      let h2 = [],
        h3 = [],
        h1 = []
      //console.log(h1)
      h1 = []
      while (i < 7) {
        j = 0
        h2 = []
        while (j < 10) {
          k = 0
          h3 = []
          while (k < 10) {
            const msl = this.getproductsoftype(i * 100 + j * 10 + k, 1, 10)
            // var msl = [] // max sold 10 products
            // var mslc = 1
            // while (mslc <= 10) {
            //   var rnm = Math.floor(Math.random() * totalimages)
            //   msl.push({
            //     product_id: mslc,
            //     name: 'product Name:' + mslc,
            //     thumbnail: sedoimages[rnm],
            //     prices: [
            //       { quantity: 100, unit: 'pcs', price: '1000' },
            //       { quantity: 30, unit: 'pcs', price: '350' },
            //       { quantity: 10, unit: 'pcs', price: '150' },
            //       { quantity: 1, unit: 'pcs', price: '15' }
            //     ],
            //     images: '["1315.png", "1213.png", "11.png" ]'
            //   })
            //   mslc++
            // }
            h3.push({
              id: i * 100 + j * 10 + k,
              name: 'product_type:' + i + ' > ' + j + ' > ' + k,
              image: '/pr/cat/img.jpg',
              mostSoldTenProducts: [...msl]
            })
            k++
          }
          h2.push({
            id: i * 10 + j,
            name: 'subCategory ' + i + ' > ' + j,
            svg_name: 'menu',
            product_types: [...h3]
          })
          j++
        }
        h1.push({ id: i, name: 'Category ' + i, subCategories: [...h2] })
        i++
      }
      return h1
    }
  }
}
export default serverdata
