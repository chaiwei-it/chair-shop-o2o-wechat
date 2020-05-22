const app = getApp()

import lib from '../../utils/lib.js'
const { api, ajax } = lib

Page({
  data: {
    cartIds: '',
    goodsList: '',
    address: '',
    addressId: ''
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      cartIds: options.cartIds,
    })
  },

  onReady() {
    var that = this;
    that.getGoodsList()
    that.getDefaultAddress()
  },

  getGoodsList: function () {
    var that = this;
    let callback = (data) => {
      that.setData({
        goodsList: data.list,
        goodsPrice: data.goodsPrice,
        goodsNum: data.goodsNum
      })
    }
    let data = ({
      cartIds: that.data.cartIds
    })
    ajax.post(api.getCartList, data, callback)
  },

  getDefaultAddress: function () {
    var that = this;
    let callback = (data) => {
      console.log(data.data)
      if (data.id){
        that.setData({
          address: data,
          addressId: data.id
        })
      }
    
    }
    let data = ({

    })
    ajax.post(api.getDefaultAddress, data, callback)
  },

  submitOrder: function () {
    var that = this;
    if (that.data.addressId == '') {
      wx.showToast({
        title: '请先选择收货地址',
        icon: 'none',
        duration: 2000
      })
    } else {
      let callback = (data) => {
        app.getCartNum()
        wx.redirectTo({
          url: '../order/details?id=' + data.orderId,
        })
      }
      let data = ({
        cartIds: that.data.cartIds,
        addressId: that.data.address.id,
      })
      ajax.post(api.orderCreate, data, callback)
    }
  }

})
