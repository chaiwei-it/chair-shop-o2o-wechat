const app = getApp()

import lib from '../../utils/lib.js'
const { api, ajax } = lib

Page({
  data: {
    navbar: ['全部订单', '待支付', '待发货', "待收货", "交易完成"],
    //count:[0,2,3],                                  //记录不同状态记录的数量
    currentTab: 0,
    orderList: [],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.setData({
      currentTab: options.id,
    })

  },

  onShow: function () {
    this.getOrderList();
  },

  getOrderList: function () {
    var that = this;
    var num = that.data.currentTab
    if (num == 0) {
      num = ''
    } else if (num == 1) {
      num = 10
    } else if (num == 2) {
      num = 20
    } else if (num == 3) {
      num = 30
    } else if (num == 4) {
      num = 40
    } else if (num == 5) {
      num = 0
    }
    that.setData({
      orderList: [],
    });
    let callback = (data) => {
      that.setData({
        orderList: data.list,
      });
    }
    let data = ({
      orderStatus: num,
    })
    ajax.post(api.orderList, data, callback)
  },
  //响应点击导航栏
  navbarTap: function (e) {
    var that = this;
    // console.log(e.currentTarget.dataset.idx);
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      TypeItem: that.data.navbar[that.data.currentTab]
    })
    this.getOrderList();
  },

  //下拉
  onPullDownRefresh() {
    var self = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.stopPullDownRefresh();
    setTimeout(() => {
      // 模拟请求数据，并渲染
      // 数据成功后，停止下拉刷新
      this.getOrderList();
      wx.hideLoading()
    }, 1000);
  },
})
