const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib

Page({
  data: {
    id: '',
    details: '',
    price:0.0,
    payStatus: 0,
    wxpay:''
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id,
      });
    }
    this.getdetails()
    console.log(this.data.id)
  },

  getdetails: function () {
    var that = this;
    wx.request({
      url: api.getdetails + that.data.id,
      method: 'GET',
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code == 20000) {
          that.setData({
            details: data.data[0],
          });
        }
      }
    });
  },

  //获取用户输入的用户名
  priceInput: function (e) {
    this.setData({
      price: e.detail.value
    })
  },

  pay:function(e){
    var that = this;
    wx.request({
      url: api.wxpay,
      method: 'POST',
      data: ({
        orderId: that.data.id,
        orderType: 2,
        appId: 1,
      }),
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code == 20000) {
          that.setData({
            wxpay: data.data[0]
          })
          that.wxpay(data.data[0])

        }
      }
    });
  },

  //支付
  wxpay: function (data) {
    var that = this;
    console.log(data)
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': 'prepay_id=' + data.prepayId,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        var status = true
        wx.showLoading({
          title: '支付中',
        })
        that.polling()
        // setTimeout(function () {
        //   that.getdetails()
         
        //   console.log(that.data.order.status)
        // }, 2000)

      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          duration: 2000
        })
      },
      'complete': function (res) {
      }
    })
  },

  polling:function(){
    var that = this
    that.getPayStatus()
    var that = this
    if (that.data.payStatus == 0){
      setTimeout(function () {
        that.polling();
        console.log('等待支付结果')
      }, 1000)
    }
  },

  getPayStatus(){
    var that = this;
    wx.request({
      url: api.wxpaySelect,
      method: 'POST',
      data: ({
        id: that.data.wxpay.id,
      }),
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code == 20000) {
          if(data.data[0].payStatus == 1){
            that.setData({
              payStatus: 1,
            })
            wx.hideLoading();
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      }
    });
  }

})