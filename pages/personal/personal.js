//index.js
//获取应用实例
const app = getApp()
import lib from '../../utils/lib.js'
import code from '../../utils/code.js'
const { api, util, ajax } = lib


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    notPay: 0,
    notCollect: 0,
    notDeliver: 0,
    orderFinish: 0,
    user:'',
    userRebate:'',
    code:'',
    hiddenmodalput: true,
    isShow: false,         //默认按钮1显示，按钮2不显示
    sec: "60",　　　　　　　　//设定倒计时的秒数
    mobile:'',
    vCode:'',
    sCode:''
  },

  onHide: function(){

  },

  onLoad: function () {
    var that = this;  
  },

  onShow: function () {
    this.getLogin();
    // this.getOrderNum();
  },

  getLogin: function () {
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        wx.setStorageSync("sessionId", data.data[0].sessionId);
        wx.setStorageSync("codeId", data.data[0].codeId);
        wx.setStorageSync("userRebate", data.data[0].user);
        that.setData({
          userRebate: data.data[0].user
        })
      }
    }
    let data = ({
      keywords: 'index'
    })
    ajax.post(api.getLogin, data, callback)
  },

  //获取订单信息
  getOrderNum:function(){
    var that = this;
    wx.request({
      url: api.getOrderNum,
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
      },
      success(res) {
        var data = res.data.data[0];
        that.setData({
          notPay: data.notPay,
          notCollect: data.notCollect,
          notDeliver: data.notDeliver,
          orderFinish: data.orderFinish
        });
      },
    });
  } ,

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
        if (data.code == 200) {
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
                    var username = wx.getStorageSync("user").memberName
                    if (res.statusCode === 200) {
                      that.updateImage(logoImage,codeImg, username);
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
      x: 80,
      y: 100,
      width: 590,
      height: 1000,
      destWidth: 590,
      destHeight: 1000,
      canvasId: 'myCanvas',
      success: function (res) {
        that.setData({
          shareImgSrc: res.tempFilePath
        })
        wx.hideLoading();
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImgSrc,
          success(res) {
            wx.previewImage({
              current: that.data.shareImgSrc, // 当前显示图片的http链接
              urls: [that.data.shareImgSrc] // 需要预览的图片http链接列表
            })
          }
        })

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  getCode: function (e) {
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

  getMobile:function(e){
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
        wx.setStorageSync("userRebate", data.data[0]);
        wx.hideLoading()
        wx.showToast({
          title: '绑定手机号成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(){
        wx.hideLoading()
        wx.showToast({
          title: '绑定手机号失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  } ,


  getPhoneNumber: function (e) {
    var that = this
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      that.getCode(e)
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
  sendCode:function(){
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
        if (data.code == 200){
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
    if (that.data.mobile == ''){
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
    }else if (that.data.sCode != that.data.vCode){
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.request({
        url: api.updateMobile,
        method: 'GET',
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
          if (data.code == 200) {
            wx.setStorageSync("userRebate", data.data[0]);
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

  showRebate: function () {
    wx.navigateToMiniProgram({
      appId: 'wx69f7eabb29bbc277',
      path: 'pages/index/index',
      envVersion: 'trial', //体验版
      // envVersion: 'release', //正式版
      success(res) {
        // 打开成功
        console.log('打开成功')
      },
      fail(e) {
        console.log('打开失败' + e)
      }
    })
  },  


})
