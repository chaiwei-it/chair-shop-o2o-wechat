//index.js
//获取应用实例
const app = getApp()
import lib from '../../utils/lib.js'
const { api, util } = lib

Page({
  data: {
    motto: 'Hello World',
    codeId:'',
    member: '',
    userRebate: '',
    todayPrice: 0.0,
    toMonthPrice: 0.0,
    totalPrice: 0.0,
    estimatePrice: 0.0,
  },

  onLoad: function (options) {
    if (options.codeId) {
      this.setData({
        codeId: options.codeId
      });
    }
    this.login();
  },

  getRebatePrice: function () {
    var that = this;
    wx.request({
      url: api.getRebatePrice,
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
            todayPrice: data.data[0].todayPrice,
            toMonthPrice: data.data[0].toMonthPrice,
            totalPrice: data.data[0].totalPrice,
            estimatePrice: data.data[0].estimatePrice,
          });
        }
      }
    });
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },


  login: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getSetting({
          success(setRes) {
            // 判断是否已授权  
            if (!setRes.authSetting['scope.userInfo']) {
              // 授权访问  
              wx.authorize({
                scope: 'scope.userInfo',
                success() {
                  //获取用户信息  
                  wx.getUserInfo({
                    lang: "zh_CN",
                    success: function (userRes) {
                      app.globalData.userInfo = userRes.userInfo
                      //发起网络请求  
                      wx.request({
                        url: api.login,
                        data: {
                          code: res.code,
                          encryptedData: userRes.encryptedData,
                          iv: userRes.iv,
                          codeId: that.data.codeId,
                          appId:2
                        },
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'POST',
                        //服务端的回掉  
                        success: function (res) {
                          var data = res.data.data[0];
                          wx.setStorageSync("sessionId", data.sessionId);
                          wx.setStorageSync("codeId", data.codeId);
                          wx.setStorageSync("user", res.data.data[1]);
                          wx.setStorageSync("userRebate", res.data.data[2]);
                          that.setData({
                            showView: true,
                            member: res.data.data[1],
                            userRebate: res.data.data[2]
                          })
                          wx.hideLoading();
                          // userId = data;
                        }
                      })
                    }
                  })
                }
              })
            } else {
              //获取用户信息  
              wx.getUserInfo({
                lang: "zh_CN",
                success: function (userRes) {
                  // console.log(userRes.userInfo)
                  app.globalData.userInfo = userRes.userInfo
                  //发起网络请求  
                  wx.request({
                    url: api.login,
                    data: {
                      code: res.code,
                      encryptedData: userRes.encryptedData,
                      iv: userRes.iv,
                      codeId: that.data.codeId,
                      appId: 2
                    },
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    success: function (res) {
                      var data = res.data.data[0];
                      wx.setStorageSync("sessionId", data.sessionId);
                      wx.setStorageSync("codeId", data.codeId);
                      wx.setStorageSync("user", res.data.data[1]);
                      wx.setStorageSync("userRebate", res.data.data[2]);
                      that.setData({
                        showView: true,
                        member: res.data.data[1],
                        userRebate: res.data.data[2]
                      })
                      that.getRebatePrice();
                      wx.hideLoading();
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  //转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '木头商城',
      path: '/pages/rebate/index?codeId=' + wx.getStorageSync("codeId")
    }
  },

})
