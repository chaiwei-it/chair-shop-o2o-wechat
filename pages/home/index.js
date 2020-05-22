//index.js
//获取应用实例
const app = getApp()
import lib from '../../utils/lib.js'
const { api, user, ajax} = lib

Page({
  data: {
    navbar: [{ gcName: '木头推荐', gcId: 0}],                                //记录不同状态记录的数量
    currentTab: 0,
    banner: [],
    hot: [],
    newest: [],
    recommend: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    list:[],
    userNum:'',
    parentNum:'',
    showView: true,
    scene:'',
    partnerList:[],
    recommendList:[],
    codeId: '',
    isPage:false
  },

  onLoad: function (options) {
    console.log(options)
    if (options.scene) {
      this.setData({
        scene: options.scene,
      })
    }
  },

  onReady() {
    var that = this
    
    
    
  },

  onShow: function () {
    var that = this
    if (that.data.scene) {
      console.log('准备登陆' + that.data.scene)
      wx.reLaunch({
        url: '../index/index?scene=' + that.data.scene
      })
    }else{
      app.getCartNum()
      that.getCode()
      //获取分类
      that.getCategoryList()
      //获取自营商品
      that.getSelfGoodList();
      //获取banner
      that.getBannerList();
      //获取新品
      that.getNewest()
      //获取热销
      that.getHottest()
      //获取推荐
      that.getRecommend()
    }
    
  },

  //下拉刷新
  onPullDownRefresh(){
    var that = this
    //获取分类
    that.getCategoryList()
    //获取自营商品
    that.getSelfGoodList();
    //获取banner
    that.getBannerList();
    //获取新品
    that.getNewest()
    //获取热销
    that.getHottest()
    //获取推荐
    that.getRecommend()
  },

  //获取分类列表
  getCategoryList: function () {
    var that = this;
    let callback = (data) => {
      var data= data.list
      that.setData({
        navbar: [{ name: '木头推荐', id: 0 }],
      })
      var navbar = that.data.navbar
      for (var i = 0; i < data.length; i++) {
        navbar.push(data[i])
      }
      that.setData({
        navbar: navbar,
        isPage: true
      })
    }
    let data = ({
      parentId: 0
    })
    ajax.post(api.goodsClassList, data, callback)
  },

  //获取banner
  getBannerList: function () {
    var that = this;
    let callback = (data) => {
      that.setData({
        banner: data.list,
      });
    }
    let data = ({
      keywords: 'index'
    })
    ajax.post(api.bannerList, data, callback)
  },

  // 最新商品
  getNewest: function () {
    var that = this;
    let callback = (data) => {
      that.setData({
        newest: data.list,
      });
    }
    let data = ({
      keywords: 'newest'
    })
    ajax.post(api.indexGoodsList, data, callback)
  },

  // 热销商品
  getHottest: function () {
    var that = this;
    let callback = (data) => {
      that.setData({
        hot: data.list,
      });
    }
    let data = ({
      keywords: 'hottest'
    })
    ajax.post(api.indexGoodsList, data, callback)
  },

  // 推荐商品
  getRecommend: function () {
    var that = this;
    let callback = (data) => {
      that.setData({
        recommend: data.list,
      });
    }
    let data = ({
      keywords: 'recommend'
    })
    ajax.post(api.indexGoodsList, data, callback)
  },

  //响应点击导航栏
  navbarTap: function (e) {
    var that = this;
    that.setData({
      list: [],
      currentTab: e.currentTarget.dataset.idx,
      TypeItem: that.data.navbar[that.data.currentTab]
    })
    if (e.currentTarget.dataset.idx == 0){
      that.getSelfGoodList()
    } else {
      var classId = that.data.navbar[that.data.currentTab].id
      that.getClassGoods(classId)
    }
  },

  // 获取自营商品
  getSelfGoodList:function(){
    var that = this;
    let callback = (data) => {
      that.setData({
        list: data.list,
      });
    }
    let data = ({
      goodsType: 1
    })
    ajax.post(api.selfGoodsList, data, callback)
  },

  //获取分类商品
  getClassGoods: function (classId) {
    var that = this;
    let callback = (data) => {
      that.setData({
        list: data.list,
      });
    }
    let data = ({
      classId: classId
    })
    ajax.post(api.classGoodsList, data, callback)
  },

  //转发
  onShareAppMessage: function (res) {
    var that = this; 
    return {
      title: '木头商城',
      path: '/pages/index/index?scene=' + that.data.codeId,
        imageUrl: '/images/goods/share.jpg'
    }
  },

  //获取分享信息
  getCode: function (res) {
    var that = this;
    let callback = (data) => {
      that.setData({
        codeId: data.data[0].id,
      });
      wx.showShareMenu({
        withShareTicket: true
      })
    }
    let data = ({
      goodsId: 'index',
    })
    ajax.get(api.getQRCode, data, callback)
  },

})