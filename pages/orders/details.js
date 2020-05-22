const app = getApp()

import lib from '../../utils/lib.js'
const { api, ajax } = lib

Page({
  data: {
    orderId: '',
    order: {},
    address: '',
    addressId: '',
    username: '',
    mobile: '',
    status: 10,
    wxpay: ''
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      orderId: options.id,
    })
  },

  onReady(){
    this.getDetail()
  },

  getDetail() {
    var that = this;
    let callback = (data) => {
      that.setData({
        order: data,
      });
    }
    let data = ({
      id: that.data.orderId
    })
    ajax.post(api.orderDetails, data, callback)
  },

  pay: function () {
    var that = this;
    console.log(that.data.order)
    wx.request({
      url: api.wxpay,
      method: 'POST',
      data: ({
        orderId: that.data.order.id,
        orderType: 1,
        appId: 1
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded', 
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      success(res) {
        var data = res.data;
        console.log(data);
        if (data.code == 20000) {
          that.setData({
            wxpay: data.data[0]
          })
          that.wxpay(data.data[0])
          console.log(data.data[0])
        }
      },
    });
  },

  //支付
  wxpay: function(data) {
    var that = this;
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

  polling: function () {
    var that = this
    that.getPayStatus()
    var that = this

    if (that.data.status == 10) {
      setTimeout(function () {
        that.polling();
        console.log('等待支付结果')
      }, 1000)
    }
  },

  getPayStatus() {
    var that = this;
    wx.request({
      url: api.wxpaySelect,
      method: 'GET',
      data: ({
        id: that.data.wxpay.id,
      }),
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          if (data.data[0].payStatus == 1) {
            that.setData({
              status: 20,
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
  },

  rebate:function(){
    var that = this;
    wx.request({
      url: api.rebateCreat,
      method: 'POST',
      data: ({
        orderId: that.data.order.orderId,
      }),
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      'success': function (res) {
        console.log('返利成功')
      },
      'fail': function (res) {
        console.log('返利失败')
      },
      'complete': function (res) {
        console.log('返利完成')
      }
    })
  },

  //取消
  cancel: function () {
    var that = this;
    wx.request({
      url: api.cancleorder,
      method: 'GET',
      data: ({
        ordersn: that.data.order.orderSn
      }),
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      'success': function (res) {
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          var pages = getCurrentPages(); // 当前页面
          var beforePage = pages[pages.length - 2]; // 前一个页面 
          wx.navigateBack({ 
            success: function () {
              beforePage.getOrderList(); // 执行前一个页面的onLoad方法  
            },
            // changed: true 
          });
        }, 1000)
      },
      'fail': function (res) {
        wx.showToast({
          title: '取消失败',
          icon: 'success',
          duration: 2000
        })
      },
      'complete': function (res) {
      }
    })
  },

  //确认收货
  confirm: function () {
    var that = this;
    wx.request({
      url: api.finishorder,
      method: 'GET',
      data: ({
        ordersn: that.data.order.orderSn
      }),
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      'success': function (res) {
        wx.showToast({
          title: '确认成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          that.getDetail()
        }, 1000)
      },
      'fail': function (res) {
        wx.showToast({
          title: '确认失败',
          icon: 'success',
          duration: 2000
        })
      },
      'complete': function (res) {
      }
    })
  },

  //删除
  delete: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: api.delorder,
            method: 'GET',
            data: ({
              orderid: that.data.order.orderId
            }),
            header: {
              'Content-Type': 'application/x-www-form-urlencoded', // 默认值
              'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
            },
            'success': function (res) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                var pages = getCurrentPages(); // 当前页面
                var beforePage = pages[pages.length - 2]; // 前一个页面 
                wx.navigateBack({
                  success: function () {
                    beforePage.getOrderList(); // 执行前一个页面的onLoad方法  
                  },
                  // changed: true 
                });
              }, 1000)
            },
            'fail': function (res) {
              wx.showToast({
                title: '删除失败',
                icon: 'success',
                duration: 2000
              })
            },
            'complete': function (res) {
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    
  }


})
