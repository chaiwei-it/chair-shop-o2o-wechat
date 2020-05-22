// pages/putforward/list.js
const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib
Page({
  data: {
    list: [],
  },

  onLoad: function (options) {
    this.getPutList();
  },

  //提交数据
  getPutList: function (e) {
    var that = this
    wx.request({
      url: api.getPutList,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      data: ({
      }),
      success(res) {
        var data = res.data
        if (data.code == 20000) {
          that.setData({
            list: data.data[0]
          })
        } 
      }
    })
  }

})