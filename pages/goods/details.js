const app = getApp()

import lib from '../../utils/lib.js'
const { api, user, util, ajax, qrCode } = lib

Page({
  data: {
    goodsId: '',
    images:[],
    detail:[],
    detailImages:[],
    cartNum: 0,
    //转发ID
    codeId:'',
    codeImage:'',
    // 生成图片路径
    imageUrl: '',
    //生成图片状态
    qrcodeStatus: false,
    statusNum: 0,
    data: {
      codeImageUrl: '',
      backgroundImageUrl: '',
      goodsImageUrl: '',
      logoImageUrl: '',
      userImageUrl: '',
      goodsName: '',
      goodsNowPrice: '',
      goodsOldPrice: '',
      userName: '',
    }

  },

  onLoad: function (options) {
    var that = this;
    console.log('初始化' + options.scene)
    if (options.scene) {
      this.setData({
        scene: options.scene,
      })
    }
    if (options.id){
      this.setData({
        goodsId: options.id,
      })
      that.getGoodsDetails();
      
      
    }
  },

  onReady() {
    var that = this; 
    if (that.data.scene) {
      console.log('准备登陆' + that.data.scene)
      wx.reLaunch({
        url: '../index/index?scene=' + that.data.scene
      }) 
    }
    that.getCode()
  },

  onShow() {
    var that = this;
    let callback = (data) => {
      this.setData({
        cartNum: data,
      })
    }
    app.getCartNum(callback);
    
  },

  //获取商品详情
  getGoodsDetails:function(){
    var that = this;
    let callback = (data) => {
      that.setData({
        detail: data,
        detailImages: data.detailImage.split(','),
      });
    }
    let data = ({
      id: that.data.goodsId
    })
    ajax.post(api.selectGoods, data, callback)
  },

  //加入购物车
  addCart: function (event){
    var that = this;
    var specId = ""
    let callback = (data) => {
      // that.hideSpec()
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
      that.setData({
        cartNum: parseInt(that.data.cartNum) + 1
      })
    }
    let data = ({
      goodsId: that.data.goodsId,
      goodsNum: 1,
      specId: specId,
    })
    ajax.post(api.addCart, data, callback)
  },

  //获取分享信息
  getCode: function (res) {
    var that = this;
    let callback = (data) => {
      that.setData({
        codeId: data.data[0].id,
        codeImage: data.data[0].codeUrl,
      });
      wx.showShareMenu({
        withShareTicket: true
      })
    }
    let data = ({
      goodsId: that.data.goodsId,
    })
    ajax.get(api.getQRCode, data, callback)
  },

  onShareAppMessage: function (res) {
    var that = this; 
    return {
      title: '木头商城',
      path: '/pages/index/index?scene=' + that.data.codeId,
      imageUrl: '/images/goods/share.jpg'
    } 
  },

  //打开二维码分享
  showQrcode: function () {
    var that = this;
    that.setData({
      qrcodeStatus: true
    })
    if (that.data.imageUrl === '') {
      wx.showLoading({
        title: '图片生成中...',
      })
      that.produceQRCode()
    }
  },

  //关闭二维码分享
  hideQrcode: function () {
    var that = this;
    wx.hideLoading();
    that.setData({
      qrcodeStatus: false
    })
  },

  // 准备获取信息
  produceQRCode: function () {
    var that = this;
    //1.生成二维码图片
    let codeCallback = (data) => {
      that.setData({
        ['data.codeImageUrl']: data,
      });
    }
    console.log(that.data.codeImage)
    that.getImageUrl(that.data.codeImage, codeCallback)
    //2.获取背景
    var backgroundImageUrl = 'https://shop-v1.oss-cn-beijing.aliyuncs.com/index/background.png'
    let backgroundCallback = (data) => {
      that.setData({
        ['data.backgroundImageUrl']: data,
      });
    }
    that.getImageUrl(backgroundImageUrl, backgroundCallback)
    //3.获取商品图片
    let goodsCallback = (data) => {
      that.setData({
        ['data.goodsImageUrl']: data,
      });
    }
    that.getImageUrl(that.data.detail.thumbnailImage, goodsCallback)
    //4.获取logo图片
    // var logoImage = 'https://shop-v1.oss-cn-beijing.aliyuncs.com/index/logo.jpg'
    // let logoCallback = (data) => {
    //   that.setData({
    //     ['data.logoImageUrl']: data,
    //   });
    // }
    // that.getImageUrl(logoImage, logoCallback)
    //5.获取用户图片
    let userCallback = (data) => {
      that.setData({
        ['data.userImageUrl']: data,
      });
    }
    that.getImageUrl(wx.getStorageSync("user").headImage, userCallback)
    //6.获取商品名称
    //7.获取商品价格
    //8.获取商品原价
    //9.获取用户名
    var goodsName = that.data.detail.name
    var userName = wx.getStorageSync("user").username
    that.setData({
      ['data.goodsName']: goodsName.length > 10 ? goodsName.substr(0, 10) + '...' : goodsName,
      ['data.goodsNowPrice']: that.data.detail.nowPrice,
      ['data.goodsOldPrice']: that.data.detail.originalPrice,
      ['data.userName']: userName.length > 8 ? userName.substr(0, 8) + '...' : userName
    });
    //10.创建图片
    that.createGoodsCode()
  },

  // 获取图片
  getImageUrl: function (url, callback) {
    console.log('进入下载')
    var that = this;
    var url = util.replace(url);
    console.log('执行下载' + url)
    wx.downloadFile({
      url: url,
      success: function (res) {
        
        console.log('下载-' + res.statusCode)
        console.log('地址-' + res.tempFilePath)
        if (res.statusCode === 200) {
          callback(res.tempFilePath)
        }
      },
      fail:function(){
        console.log('下载-' + res.statusCode)
      },
      complete:function(){
        that.setData({
          statusNum: that.data.statusNum + 1
        });
      }
    })
  },

  //创建图片
  createGoodsCode(){
    var that = this;
    if(that.data.statusNum >= 4){
      //创建完成回调
      let callback = (data) => {
        //展示弹出框
        // that.showModal()
        wx.hideLoading();
        that.setData({
          imageUrl: data
        });
      }
      qrCode.createGoodsCode(that.data.data, callback)
    }else{
      setTimeout(function () {
        that.createGoodsCode()
      }, 500)
    }
    
  }
     
})
