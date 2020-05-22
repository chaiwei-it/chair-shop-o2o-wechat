const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib

Page({
  data: {
    userRebate: '',
  },

  onShow: function (options) {
    var that = this
    that.setData({
      userRebate: wx.getStorageSync("userRebate"),
    });
  },


})