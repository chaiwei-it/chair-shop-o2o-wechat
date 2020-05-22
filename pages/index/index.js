const app = getApp()

import lib from '../../utils/lib.js'
const { api, user, ajax } = lib

Page({
  data: {
    breakStatus: false,
    isLogin: false,
    code: '',
    codeId: '',
    pCodeId: '',
    encryptedData: '',
    iv: ''
  },

  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '登录中...',
    })
    console.log(options)
    that.pagerBefore(options, app)
  },

  //获取转发信息
  pagerBefore: function (options) {
    var that = this
    console.log('进入登录' + options.scene)
    if (options.codeId) {
      that.setData({
        pCodeId: options.codeId,
      })
    }
    if (options.scene) {
      that.setData({
        pCodeId: options.scene
      })
    }
    if (options.breakStatus) {
      that.setData({
        breakStatus: options.breakStatus
      })
    }
    this.getCode()
  },

  //获取code
  getCode: function () {
    var that = this
    wx.login({
      success: res => {
        that.setData({
          code: res.code,
        })
        that.login()
      }
    })
  },

  //注册
  login: function (){
    var that = this;
    let callback = (data) => {
      wx.setStorageSync("sessionId", data.data[0].sessionId);
      if(data.data[0].isRegister){
        //已注册
        if (that.data.breakStatus){
          wx.navigateBack({
            delta: 1
          })
          return
        }
        app.getLogin(data.data[0].url)

      }else{
        //未注册
        that.isUserInfo()
      }
    }
    let data = ({
      code: that.data.code,
      codeId: that.data.pCodeId,
      appId: 1
    })
    ajax.post1(api.login, data, callback)
  },

  

  // 判断是否授权
  isUserInfo: function () {
    var that = this
    wx.getSetting({
      success(res) {
        // 判断是否已授权  
        if (!res.authSetting['scope.userInfo']) {
          wx.hideLoading();
          that.setData({
            isLogin: true,
          })
        } else {
          that.getUserInfo()
        }
      },
      false(e) {
        that.isUserInfo(app)
      }
    })
  },

  // 获取微信信息
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          encryptedData: res.encryptedData,
          iv: res.iv,
        })
        that.register()
      },
      false(e) {
        that.autoLogin()
      }
    })
  },
 
  //登录
  register: function () {
    var that = this;
    wx.request({
      url: api.register,
      data: {
        encryptedData: that.data.encryptedData,
        iv: that.data.iv,
        appId: 1
      },
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        var data = res.data;
        if (data.code == 20000) {
          // that.setData({
          //   url: data.data[0].url,
          // })
          app.getLogin(data.data[0].url)
        } else {
          that.wxLogin()
        }
      }
    })
  },

  onGotUserInfo: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showToast({
        title: '拒绝将无法进入系统，请重新登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.getUserInfo()
      wx.showLoading({
        title: '登录中',
      })
      // that.wait();
    }
  },


  wait: function () {
    var that = this
    if (wx.getStorageSync("isPage")) {
      wx.hideLoading();
      var url = wx.getStorageSync("url");
      if (url == 'index'){
        wx.switchTab({
          url: '../home/index'
        })
      }else{
        wx.navigateTo({
          url: '../goods/details?id=' + url
        })
      }
      return
    }
    //递归做轮询
    setTimeout(function () {
      that.wait()
    }, 500)
  },

})