import lib from './utils/lib.js'
const { api, ajax, user } = lib

App({
  globalData: {
    userId: '',
    userInfo: '',
    userNum:'',
    codeId: '',
    isPage: false,
    card:'',
    code:''
  },

  onLaunch: function () {
    var that = this
    wx.clearStorage()
    // wx.hideTabBar()
    that.updateApp()
  },

  //获取购物车数量
  getCartNum(oldCallback) {
    var that = this;
    let callback = (data) => {
      wx.setStorageSync("goodsNum", data.goodsNum)
      if (data.goodsNum === 0){
        wx.removeTabBarBadge({
          index: 1
        })
      }else{
        wx.setTabBarBadge({
          index: 1,
          text: "" + data.goodsNum
        })
      }
      if (oldCallback){
        oldCallback(data.goodsNum)
      }
      
    }
    let data = ({
    })
    ajax.post(api.getCartNum, data, callback)
  },

  getLogin: function (url) {
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        wx.setStorageSync("sessionId", data.data[0].sessionId);
        wx.setStorageSync("codeId", data.data[0].codeId);
        wx.setStorageSync("user", data.data[1]);
        wx.setStorageSync("userRebate", data.data[2])
      }
      if (url == 'index') {
        wx.switchTab({
          url: '../home/index'
        })
      } else {
        wx.redirectTo({
          url: '../goods/details?id=' + url
        })
      }
    }
    let data = ({
      keywords: 'index'
    })
    ajax.post(api.getLogin, data, callback)
  },

  updateApp:function(){
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        },
        false: function (e) {
          console.log(e)
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  }
  
})