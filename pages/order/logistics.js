const app = getApp()

import lib from '../../utils/lib.js'
const { api, ajax } = lib
Page({

  data: {
    shippingCode:'',
    shipping: [],
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      shippingCode: options.shippingCode,
    })
  },

  onReady: function () {

  },

  onShow: function () {
    this.getLogistics()
  },

  getLogistics: function(){
    var url = 'https://www.songzhuangyoupin.com/query'
    var that = this;
    let callback = (data) => {
      if (data.status === '200'){
        console.log(data.data)
        that.setData({
          shipping: data.data,
        })
      }
    }
    let data = ({
      type: 'shentong',
      postid: that.data.shippingCode
    })
    ajax.get1(url, data, callback)
  }

})