import '@/functions/interfeces'
const self_ts = {
  parseAmount(_amnt: string | number, _fixposition: number = 2, _type: string = 'a') {
    //['float'>always floating number with _fixedposition mu,ber of digit after decimal point
    //|'int' always integer number rounding the amount
    //|'a' if result is in integer then out integer else out float ]
    let _hf = parseFloat(String(_amnt))
    _hf = parseFloat(_hf.toFixed(_fixposition))
    if (_type == 'f' || _type == 'F' || _type == 'float' || _type == 'Float') return _hf
    const _k = Math.round(_hf)
    const _l = _k * 100
    const _h = _hf * 100
    if (_type == 'i' || _type == 'I' || _type == 'int' || _type == 'Int' || _l == _h) return _k
    else return _hf
  },
  maxPrice(priceList: productPrice[], _fixposition: number = 2, _type: string = 'a') {
    return this.parseAmount(
      Math.max(
        ...priceList.map((o) => parseFloat(String(o.price)) / parseFloat(String(o.quantity)))
      ),
      _fixposition,
      _type
    )
  },
  minPrice(priceList: productPrice[], _fixposition: number = 2, _type: string = 'a') {
    return this.parseAmount(
      Math.min(
        ...priceList.map((o) => parseFloat(String(o.price)) / parseFloat(String(o.quantity)))
      ),
      _fixposition,
      _type
    )
  },
  minOrder(priceList: productPrice[]) {
    //minimum quantity of order
    return this.parseAmount(Math.min(...priceList.map((o) => parseFloat(String(o.quantity)))))
  },
  getUnit(priceList: productPrice[]) {
    return priceList[0].unit
  },
  openNewpage(url: string, data: object = {}) {
    let str = ''
    for (const [key, value] of Object.entries(data)) {
      if (str != '') str = str + ','
      str = str + key + '=' + value
    }
    console.log(str)
    window.open(url, '_new', str)
  },
  openSingleProductPage(data = { id: 1 }) {
    this.openNewpage('/single/' + data.id, data)
  }
}

export default self_ts
