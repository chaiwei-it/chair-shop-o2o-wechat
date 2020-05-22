const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib

Page({
  data: {
    navbar: ['第一消费者', '第二消费者', '第三消费者'],
    currentTab: 0,
    list: [],
  },

  onLoad: function (options) {
    this.getRebateUserList();
  },

  //响应点击导航栏
  navbarTap: function (e) {
    var that = this;
    // console.log(e.currentTarget.dataset.idx);
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      TypeItem: that.data.navbar[that.data.currentTab]
    })
    that.getRebateUserList()
  },

  getRebateUserList: function () {
    var that = this;
    wx.request({
      url: api.getRebateUserList,
      method: 'GET',
      data: {
        userType: that.data.currentTab + 1
      },
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code == 20000) {
          that.setData({
            list: data.data[0],
          });
        }
      }
    });
  },
})