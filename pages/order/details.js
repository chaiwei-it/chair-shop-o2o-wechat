const app = getApp()

import lib from '../../utils/lib.js'
const { api, ajax, util } = lib

Page({
  data: {
    orderId: '',
    order: {},
    address: '',
    status: 10,
    wxpay: '',
    createTime: '',
    paymentTime: '',
    shippingTime: '',
    finnshedTime: '',
    cancelStatus:false,
    payStatus:false,
    confirmStatus:false,
    deleteStatus:false,
  },

  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      orderId: options.id,
    })
    if (options.cancelStatus){
      that.setData({
        cancelStatus: options.cancelStatus,
      })
    }
    if (options.payStatus) {
      that.setData({
        payStatus: options.payStatus,
      })
    }
    if (options.confirmStatus) {
      that.setData({
        confirmStatus: options.confirmStatus,
      })
    }
    if (options.deleteStatus) {
      that.setData({
        deleteStatus: options.deleteStatus,
      })
    }
  },

  onReady(){

  },

  onShow: function () {
    this.getDetail()
  },

  //获取订单详情
  getDetail() {
    var that = this;
    let callback = (data) => {
      that.setData({
        order: data,
        address: data.address
      });
      if (data.createTime){
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
      //初始化操作
      if (that.data.cancelStatus) {
        that.setData({
          cancelStatus: false,
        })
        that.cancel()
      }
      if (that.data.payStatus) {
        that.setData({
          payStatus: false,
        })
        that.pay()
      }
      if (that.data.confirmStatus) {
        that.setData({
          confirmStatus: false,
        })
        that.confirm()
      }
      if (that.data.deleteStatus) {
        that.setData({
          deleteStatus: false,
        })
        that.delete()
      }
    }
    let data = ({
      id: that.data.orderId
    })
    ajax.post(api.orderDetails, data, callback)
  },

  //取消订单
  cancel: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (sm) {
        if (sm.confirm) {
          let callback = (data) => {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 2000
            })
            that.getDetail()
          }
          let data = ({
            id: that.data.orderId
          })
          ajax.post(api.cancel, data, callback)
        } else if (sm.cancel) {

        }
      }
    })
  },

  //立即支付
  pay: function () {
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        that.setData({
          wxpay: data.data[0]
        })
        that.wxpay(data.data[0])
      }
    }
    let data = ({
      orderId: that.data.order.id,
      orderType: 1,
      appId: 1
    })
    ajax.post1(api.wxpay, data, callback)
  },

  //提醒发货
  remind: function () {
    wx.showToast({
      title: '已经提醒卖家发货，请耐心等待',
      icon: 'none',
      duration: 3000
    })
  },

  //查看物流
  logistics: function () {
    wx.navigateTo({
      url: '/pages/order/logistics?shippingCode=' + this.data.order.shippingCode
    })
  },

  //确认收货
  confirm: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定已经收到商品吗？',
      success: function (sm) {
        if (sm.confirm) {
          let callback = (data) => {
            wx.showToast({
              title: '确认成功',
              icon: 'success',
              duration: 1000
            })
          that.getDetail()
          }
          let data = ({
            id: that.data.orderId
          })
          ajax.post(api.finish, data, callback)
        } else if (sm.cancel) {

        }
      }
    })
  },

  //删除订单
  delete: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          let callback = (data) => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              var pages = getCurrentPages(); // 当前页面
              var beforePage = pages[pages.length - 2]; // 前一个页面 
              wx.navigateBack({
                success: function () {
                  // beforePage.getOrderList(); // 执行前一个页面的onLoad方法  
                },
              });
            }, 1000)
          }
          let data = ({
            id: that.data.orderId
          })
          ajax.post(api.orderDelete, data, callback)
        } else if (sm.cancel) {

        }
      }
    })
  },

  //微信支付
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

    if (that.data.order.orderStatus == 10) {
      setTimeout(function () {
        that.polling();
      }, 1000)
    }
  },

  getPayStatus() {
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
          if (data.data[0].payStatus == 1) {
            // that.setData({
            //   status: 20,
            // })
            that.getDetail()
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

})
