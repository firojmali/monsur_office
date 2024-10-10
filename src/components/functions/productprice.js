export default {
  data() {
    return {
      id: 0
    }
  },
  methodes: {
    approximatePrice(prices = []) {
      var i = 0,
        minPrice = 999999999999999,
        unit = ''

      while (i < prices.length) {
        var pp = parseFloat(prices[i].price) / parseFloat(prices[i].quantity)
        if (minPrice > pp) minPrice = pp
        unit = prices[i].unit
        i++
      }
      if (minPrice == 999999999999999) return 'undefined'
      else {
        var mp1 = minPrice.toFixed(3)
        var mp2 = parseInt(mp1)
        var mpd = mp1 - parseFloat(mp2)
        //console.log(mp1, mp2, mpd)
        mpd = mpd.toFixed(3) * 1000
        if (mpd > 1) return mp1 + ' Tk per ' + unit
        else return mp2 + ' Tk per ' + unit
      }
    }
  }
}
