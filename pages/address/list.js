import lib from '../../utils/lib.js'
const { api,ajax } = lib

Page({
  data: {
    addressList: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0.00,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    status: 0,
    addressId:'',
  },

  onLoad: function (options) {
    var that = this;
    if (options.status){
      that.setData({
        status: options.status,
        addressId: options.addressId,
      })
    }
    
  },

  onShow() {//网络请求从数据库中获取购物车信息,比onReady先执行，实时显示购物车状态   
    this.getList()
    this.setData({
      hasList: true,
    });
  },

  getList:function(){
    var that = this;
    let callback = (data) => {
      that.setData({
        addressList: data.list,
      });
    }
    let data = ({
      
    })
    ajax.post(api.addressList, data, callback)
  },

  selectAddress:function(e){
    var that = this;
    var address = e.currentTarget.dataset.item
    if (that.data.status == 1){
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      var that = this
      prevPage.setData({
        address: address,
        addressId: address.id
      }),
        wx.navigateBack({ changed: true });
    }else{
      wx.navigateTo({
        url: '../address/add?addressId=' + address.id
      })
    }
    
  },
})