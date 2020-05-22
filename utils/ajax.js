import user from './user.js'

var ajax =  {
  
  post: function (url, param, callback) {
    wx.request({
      url: url,
      method: 'POST',
      data: JSON.stringify(param),
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/json;charset=UTF-8"
      },
      success(res) {
        var data = res.data
        if (data.code === 20000) {
          callback(data)
        } else if (data.code === 401) {
          // 未登录
          // user.login()
          wx.navigateTo({
            url: '/pages/index/index?breakStatus='+ true
          })
        }
      },
      fail: function (xhr, e) {
        console.error(xhr.statusText);
      }
    });
  },

  //非json提交
  post1: function (url, param, callback) {
    wx.request({
      url: url,
      method: 'POST',
      data: param,
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code === 20000) {
          callback(data)
        } else if (data.code === 401) {
          // 未登录
          // user.login()
          wx.navigateTo({
            url: '/pages/index/index?breakStatus=' + true
          })
        }
      },
      fail: function (xhr, e) {
        console.error(xhr.statusText);
      }
    });
  },

  get: function (url, param, callback) {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data;
        if (data.code === 20000) {
          callback(data)
        } else if (data.code === 401) {
          // 未登录
          // user.login()
          wx.navigateTo({
            url: '/pages/index/index?breakStatus=' + true
          })
        }
      },
      fail: function (xhr, e) {
        console.error(xhr.statusText);
      }
    });
  },

  get1: function (url, param, callback) {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      header: {
        
      },
      success(res) {
        var data = res.data;
        callback(data)
      },
      fail: function (xhr, e) {
        console.error(xhr.statusText);
      }
    });
  }
}
module.exports = ajax;