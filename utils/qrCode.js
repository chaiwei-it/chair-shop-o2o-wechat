
import api from './api.js'
import ajax from './ajax.js'

var shareImgSrc = ''

var qrCode = {

  createGoodsCode(data, callback){
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    //整体背景
    ctx.drawImage(data.backgroundImageUrl, 0, 0, 750, 1334);
    //店铺文字
    ctx.setFontSize(54)
    ctx.setFillStyle('#000')
    ctx.fillText('木头商城', 50, 100)
    //用户名称
    ctx.setFontSize(30)
    ctx.setFillStyle('#525252')
    ctx.fillText(data.userName, 340, 200, 300)
    //商品图片
    ctx.drawImage(data.goodsImageUrl, 200, 300, 350, 350);
    //商品名称
    ctx.setFontSize(38)
    ctx.setFillStyle('#525252')
    ctx.setTextAlign('center')
    ctx.fillText(data.goodsName, 375, 700)
    //商品价格
    ctx.setFontSize(42)
    ctx.setFillStyle('#f84a53')
    ctx.setTextAlign('right')
    ctx.fillText('￥' + data.goodsNowPrice, 370, 780)
    ctx.setFontSize(32)
    ctx.setFillStyle('#333333')
    ctx.setTextAlign('left')
    ctx.fillText('￥' + data.goodsOldPrice, 380, 782)
    //二维码
    ctx.drawImage(data.codeImageUrl, 250, 870, 250, 250);
   
    //说明
    ctx.setFontSize(32)
    ctx.setFillStyle('#909090')
    ctx.setTextAlign('center')
    ctx.fillText('遇见，绝非偶然', 375, 1200)
    //说明
    ctx.setFontSize(32)
    ctx.setFillStyle('#909090')
    ctx.fillText('只为更好体验', 375, 1250)
    //用户图片
    ctx.beginPath();
    ctx.arc(255, 185, 45, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(data.userImageUrl, 210, 140, 90, 90);
    ctx.draw();
    setTimeout(function () {
      that.previewImage(callback)
    }, 500)
  },



  //创建Canvas
  createCanvas: function () {

  },

  createDetailsCode: function (codeImg, goodsImage, goodsName, goodsStorePrice, callback){
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    //整体背景
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, 750, 1334);
    //上部
    ctx.setFillStyle('#fafafa')
    ctx.fillRect(0, 0, 750, 1040);
    //club
    ctx.setFontSize(90)
    ctx.setFillStyle('#353535')
    ctx.fillText('Paradise', 50, 100)
    //商品框
    ctx.setFillStyle('white')
    ctx.fillRect(50, 150, 650, 850);
    //商品图片
    ctx.drawImage(goodsImage, 50, 150, 650, 650);
    //商品名称
    ctx.setFontSize(38)
    ctx.setFillStyle('#525252')
    ctx.fillText(goodsName, 100, 860, 550)
    //商品价格
    ctx.setFontSize(42)
    ctx.setFillStyle('#f84a53')
    ctx.fillText('￥ ' + goodsStorePrice, 300, 930)
    //店铺文字
    ctx.setFontSize(54)
    ctx.setFillStyle('#000')
    ctx.fillText('木头商城', 50, 1140)
    //说明
    ctx.setFontSize(32)
    ctx.setFillStyle('#909090')
    ctx.fillText('遇见，绝非偶然', 50, 1200)
    //说明
    ctx.setFontSize(32)
    ctx.setFillStyle('#909090')
    ctx.fillText('只为更好体验', 50, 1250)
    //二维码
    ctx.drawImage(codeImg, 500, 1080, 200, 200);
    ctx.draw();
    setTimeout(function () {
      that.previewImage(callback)
    }, 500)
  },

  

  previewImage: function (callback) {
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
        shareImgSrc =  res.tempFilePath
        // wx.hideLoading();
        callback(shareImgSrc)
        // wx.saveImageToPhotosAlbum({
        //   filePath: shareImgSrc,
        //   success(res) {
        //     wx.previewImage({
        //       current: shareImgSrc, // 当前显示图片的http链接
        //       urls: [shareImgSrc] // 需要预览的图片http链接列表
        //     })
        //   }
        // })

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
    

}
module.exports = qrCode;