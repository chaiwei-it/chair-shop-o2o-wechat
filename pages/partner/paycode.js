const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib

Page({
  data: {
    id: '',
    details: '',
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id,
      });
    }
    console.log(this.data.id)
  },

  toUrl: function () {
    wx.navigateBack({
      delta: 5
    })
    // wx.redirectTo({
    //   url: '../rebate/index'
    // })
  },
})