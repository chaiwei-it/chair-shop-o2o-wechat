const app = getApp()
import lib from '../../utils/lib.js'
const { ajax, api, util } = lib

Page({

  data: {
    orderId: '',
    createTime: '',
    paymentTime: '',
    shippingTime: '',
    finnshedTime: '',
    order:{},
    rebatiList:[],
    total: 0
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      total: options.total
    })
  },

  onReady: function () {

  },

  onShow: function () {
    var that = this;
    
    console.log(that.data.orderId)
    that.getOrder();
    that.getRebate();
  },

  //获取订单详情
  getOrder() {
    var that = this;
    let callback = (data) => {
      wx.setNavigationBarTitle({
        title: data.buyerName + '的订单详情'
      })
      that.setData({
        order: data,
      });
      if (data.createTime) {
        that.setData({
          createTime: util.formatTime(data.createTime, 'Y-M-D h:m:s'),
        });
      }
      if (data.paymentTime) {
        that.setData({
          paymentTime: util.formatTime(data.paymentTime, 'Y-M-D h:m:s'),
        });
      }
      if (data.shippingTime) {
        that.setData({
          shippingTime: util.formatTime(data.shippingTime, 'Y-M-D h:m:s'),
        });
      }
      if (data.finnshedTime) {
        that.setData({
          finnshedTime: util.formatTime(data.finnshedTime, 'Y-M-D h:m:s'),
        });
      }
    }
    let data = ({
      id: that.data.orderId
    })
    ajax.post(api.orderDetails, data, callback)
  },

  getRebate: function () {
    var that = this;
    let callback = (data) => {
      var rebatiList = data.data[0];
      // var total = 0;
      // for (var i = 0; i < rebatiList.length; i++){
      //   total = total + rebatiList[i].rabatePrice
      // }
      console.log(rebatiList.length)
      that.setData({
        rebatiList: rebatiList,
        // total: total
      });
    }
    let data = ({
      orderId: that.data.orderId
    })
    ajax.get(api.getRebate, data, callback)
  }

})