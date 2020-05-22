const app = getApp()
import lib from '../../utils/lib.js'
import code from '../../utils/code.js'
const { api, util, ajax } = lib
Page({

  data: {
    user: '',
    hiddenmodalput: true,
    todayPrice: 0.0,
    toMonthPrice: 0.0,
    totalPrice: 0.0,
    notPay: 0,
    notCollect: 0,
    notDeliver: 0,
    orderFinish: 0,
    sec: "60",　　　　　　　　//设定倒计时的秒数
    mobile: '',
    vCode: '',
    sCode: '',
    totalNum: 3,
    todayNum:3,
    yesterdayNum:3,
    parentUser: {},
    parentStatus: false
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {
    this.getLogin();
    this.getOrderNum()
    this.getRebatePrice()
    this.getUserNum()
    this.getParentUser()
  },

  getLogin: function () {
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        that.setData({
          user: data.data[0].user
        })
        wx.setStorageSync('user', data.data[0].user)
      }
    }
    let data = ({
      keywords: 'index'
    })
    ajax.post(api.getLogin, data, callback)
  },

  //获取订单信息
  getOrderNum: function () {
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        that.setData({
          notPay: data.notPay,
          notCollect: data.notCollect,
          notDeliver: data.notDeliver,
          orderFinish: data.orderFinish
        });
      }
    }
    let data = ({
      keywords: 'index'
    })
    ajax.post(api.getOrderNum, data, callback)
  },

  getUserNum:function(){
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        that.setData({
          totalNum: data.data[0],
          todayNum: data.data[1],
          yesterdayNum: data.data[2]
        });
      }
    }
    let data = ({
    })
    ajax.get(api.getUserNum, data, callback)
  },

  getParentUser: function () {
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        that.setData({
          parentUser: data.data[0]
        });
      }
    }
    let data = ({
    })
    ajax.get(api.getParentUser, data, callback)
  },

  changeParentStatus(){
    var that = this;
    that.setData({
      parentStatus: !that.data.parentStatus
    });
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
            // estimatePrice: data.data[0].estimatePrice,
          });
        }
      }
    });
  },

  download: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: api.getQRCode,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      data: {
        goodsId: "index",
      },
      success(getCodeRes) {
        var data = getCodeRes.data;
        if (data.code == 20000) {
          var codeUrl = data.data[0].codeUrl;
          var url = util.replace(codeUrl);
          wx.downloadFile({
            url: url,
            success: function (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                var codeImg = res.tempFilePath
                var url = 'https://shop-v1.oss-cn-beijing.aliyuncs.com/logo/logo.png'
                url = util.replace(url);
                wx.downloadFile({
                  url: url,
                  success: function (res) {
                    var logoImage = res.tempFilePath
                    var username = wx.getStorageSync("user").username
                    if (res.statusCode === 200) {
                      that.updateImage(logoImage, codeImg, username);
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  updateImage: function (logoImage, codeImg, username) {
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    console.log('开始')
    //整体背景
    ctx.setFillStyle('#26163b')
    ctx.fillRect(0, 0, 750, 1334);
    //上部
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(80, 100, 590, 1000);
    //logo
    ctx.drawImage(logoImage, 150, 200, 180, 180);
    //店铺文字
    ctx.setFontSize(54)
    ctx.setFillStyle('#686868')
    ctx.fillText('木头商城', 350, 250)
    //说明
    ctx.setFontSize(32)
    ctx.setFillStyle('#686868')
    ctx.fillText('遇见，绝非偶然', 350, 300)
    //说明
    ctx.setFontSize(32)
    ctx.setFillStyle('#909090')
    ctx.fillText('只为更好体验', 350, 350)
    //用户名
    ctx.setFontSize(32)
    ctx.setFillStyle('#000')
    ctx.setTextAlign('center')
    ctx.fillText(username, 375, 480)
    //二维码
    ctx.drawImage(codeImg, 120, 550, 500, 500);
    ctx.draw();
    setTimeout(function () {
      that.previewImage();
    }, 500)

  },
  // 80, 100, 590, 1000
  previewImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1334,
      destWidth: 750,
      destHeight: 1334,
      canvasId: 'myCanvas',
      success: function (res) {
        that.setData({
          shareImgSrc: res.tempFilePath
        })
        wx.hideLoading();
        wx.previewImage({
          current: that.data.shareImgSrc, // 当前显示图片的http链接
          urls: [that.data.shareImgSrc] // 需要预览的图片http链接列表
        })
        // wx.saveImageToPhotosAlbum({
        //   filePath: that.data.shareImgSrc,
        //   success(res) {
            
        //   }
        // })

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  getUserCode: function (e) {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求  
          that.setData({
            code: res.code
          })
          that.getMobile(e);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  getMobile: function (e) {
    var that = this
    wx.showLoading({
      title: '绑定中...',
    })
    wx.request({
      url: api.getMobile,
      method: 'POST',
      data: ({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        code: that.data.code
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      success(res) {
        var data = res.data;
        wx.setStorageSync("user", data.data[0]);
        wx.hideLoading()
        wx.showToast({
          title: '绑定手机号成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '绑定手机号失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },


  getPhoneNumber: function (e) {
    var that = this
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      that.getUserCode(e)
    } else {
      that.modalinput()
    }
  },

  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
    wx.showToast({
      title: '不绑定手机号无法购物',
      icon: 'none',
      duration: 2000
    })
  },
  //确认
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  },

  getCode: function () {
    var _this = this;　　　　//防止this对象的混杂，用一个变量来保存
    if (_this.data.mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    } else {
      var time = _this.data.sec　　//获取最初的秒数
      code.getCode(_this, time);　　//调用倒计时函数
      this.sendCode()
    }
  },

  //获取用户输入的用户名
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  vCodeInput: function (e) {
    this.setData({
      vCode: e.detail.value
    })
  },

  //发送验证码
  sendCode: function () {
    var that = this

    wx.request({
      url: api.sendCode,
      method: 'GET',
      data: ({
        mobile: that.data.mobile,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      success(res) {
        var data = res.data;
        if (data.code == 20000) {
          that.setData({
            sCode: data.data[0]
          })
        }
      },
    });
  },

  //修改手机号
  updateMobile: function () {
    var that = this
    if (that.data.mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.vCode == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.sCode != that.data.vCode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: api.updateMobile,
        method: 'POST',
        data: ({
          mobile: that.data.mobile,
          code: that.data.vCode,
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
        },
        success(res) {
          var data = res.data;
          if (data.code == 20000) {
            wx.setStorageSync("user", data.data[0]);
            that.cancel()
            wx.showToast({
              title: '绑定手机号成功',
              icon: 'success',
              duration: 2000
            })
          }
        },
      });
    }
  },

})