
import api from './api.js'
import ajax from './ajax.js'

var user = {

  //获取转发信息
  pagerBefore: function (options, app) {
    if (options.codeId) {
      wx.setStorageSync("pCodeId", options.codeId)
    }
    if (options.scene) {
      wx.setStorageSync("pCodeId", options.scene)
    }
    this.isUserInfo(app)
  },

  // 判断是否授权
  isUserInfo: function (app) {
    var that = this
    wx.getSetting({
      success(res) {
        // 判断是否已授权  
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '../user/login',
          })
        } else {
          that.wxLogin(app)
        }
      },
      false(e) {
        that.isUserInfo(app)
      }
    })
  },

  // 自动获取微信信息
  autoLogin: function (app) {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        wx.setStorageSync("encryptedData", res.encryptedData)
        wx.setStorageSync("iv", res.iv)
        that.login(app)
      },
      false(e) {
        that.autoLogin()
      }
    })
  },

  //登录微信
  wxLogin:function(app){
    var that = this
    wx.login({
      success: res => {
        wx.setStorageSync("code", res.code)
        that.autoLogin(app)
      }
    })
  },

  //登录新系统
  login: function (app) {
    var that = this;
    wx.request({
      url: api.login,
      data: {
        code: wx.getStorageSync("code"),
        encryptedData: wx.getStorageSync("encryptedData"),
        iv: wx.getStorageSync("iv"),
        codeId: wx.getStorageSync("pCodeId"),
        appId: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',  
      success: function (res) {
        var data = res.data;
        if (data.code == 20000){
          wx.setStorageSync("sessionId", data.data[0].sessionId);
          wx.setStorageSync("codeId", data.data[0].codeId);
          wx.setStorageSync("user", data.data[1]);
          wx.setStorageSync("userRebate", data.data[2]);
          wx.setStorageSync("url", data.data[0].url);
          wx.setStorageSync("isPage", true)
          // that.pLogin(app)
        }else{
          that.wxLogin(app)
        }
      }
    })
  }

}
module.exports = user;