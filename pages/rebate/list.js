const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib

Page({
  data: {
    navbar: ['今日红包', '本月红包', '累计红包'],
    typebar: ['购物红包', '升级红包'],
    currentTab: 2,
    typeTab: 0,
    list:[],
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        currentTab: options.id,
      });
    }
    this.getRebateList();
  },

  //响应点击导航栏
  navbarTap: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
      that.getRebateList()
  },

  typeTap: function (e) {
    var that = this;
    that.setData({
      typeTab: e.currentTarget.dataset.idx,
    })
    that.getRebateList()
  },

  getRebateList: function(){
    var that = this;
    that.setData({
      list: [],
    });
    wx.request({
      url: api.getRebateList,
      method: 'GET',
      data: {
        rebateNum: that.data.currentTab,
        rebateType: that.data.typeTab + 1
      },
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if(data.code == 20000){
          that.setData({
            list: data.data[0],
          });
        }
      }
    });
  },
})