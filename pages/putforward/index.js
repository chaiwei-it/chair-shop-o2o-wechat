const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib

Page({
  data: {
    balance: 0,
    showMessage: false,
    messageContent: '',
  },

  onLoad: function (options) {
    this.getUserRebate();
  },

  getUserRebate: function () {
    var that = this;
    wx.request({
      url: api.getUserRebate,
      method: 'GET',
      data: {
      },
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code == 20000) {
          that.setData({
            balance: data.data[0].balance,
          });
        }
      }
    });
  },

  //提交数据
  savePersonInfo: function (e) {
    var that = this;
    var data = e.detail.value
    console.log(data)
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (data.price == '') {
      console.log('提现')
      this.showMessage('请输入金额')
    } else if (data.price > that.data.balance) {
      this.showMessage('余额不足')
    } else if (data.price <= 0) {
      this.showMessage('请输入大于0的金额')
    } else if (data.alipayNum == '') {
      this.showMessage('请输入支付宝账户')
    } else if (data.alipayNum == '') {
      this.showMessage('请输入支付宝名称')
    } else if (data.mobile == '') {
      this.showMessage('请输入手机号码')
    }  else {
      var that = this
      wx.request({
        url: api.putforward,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
        },
        data: ({
          price: data.price,
          alipayNum: data.alipayNum,
          alipayName: data.alipayName,
          mobile: data.mobile,
        }),
        success(res) {
          var data = res.data
          if (data.code == 20000) {
            that.getUserRebate()
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({ changed: true });
            }, 1000)

          } else if (data.code == 60001){
            wx.showToast({
              title: data.message,
              icon: 'success',
              duration: 1000
            })
          }
        }
      });
    }
  },

  //公共提示框
  showMessage: function (text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
})