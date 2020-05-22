// page/component/new-pages/cart/cart.js
const app = getApp()

import lib from '../../utils/lib.js'
const { api, ajax } = lib

Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0.00,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    obj: {
      name: "hello"
    },
    model: '',
    // orders: ["oordd"],
    // goodsId:'',
    cartIds:''
  },

   onLoad: function () {

  },

  onShow() {
    console.log("打开")
    this.getList()
    app.getCartNum()
  },

  onReady: function () {

  },

  onHide: function () {

  },

  //获取购物车列表
  getList:function(){
    var that = this;
    let callback = (data) => {
      var carts = data.list
      for (let i = 0; i < carts.length; i++) {
        carts[i].selected = true;
      }
      that.setData({
        carts: carts,
        hasList: carts.length > 0,
      });
      that.getTotalPrice();
    }
    let data = ({
    })
    ajax.post(api.cartList, data, callback)
  },

  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    if (!carts[index].selected){
      this.setData({
        selectAllStatus: false
      });
    }
    this.getTotalPrice();
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    let carts = that.data.carts;
    let num = carts[index].goodsNum;
    num = num + 1;
    let callback = (data) => {
      if (data.code == 20000) {
        carts[index].goodsNum = num;
        that.setData({
          carts: carts
        });
        that.getTotalPrice();
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        app.getCartNum()
      } else if (data.code == 40002) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }
    let data = ({
      goodsNum: num,
      id: that.data.carts[index].id,
    })
    ajax.post(api.updateList, data, callback)
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = that.data.carts;
    let num = carts[index].goodsNum;
    if (num <= 1) {
      // wx.showToast({
      //   title: '最小数量为1',
      //   icon: 'none',
      //   duration: 2000
      // })
      that.delete(e);
      return false;
    }
    num = num - 1;
    let callback = (data) => {
      if (data.code == 20000) {
        carts[index].goodsNum = num;
        that.setData({
          carts: carts
        });
        that.getTotalPrice();
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        app.getCartNum()
      } else if (data.code == 40002) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }
    let data = ({
      goodsNum: num,
      id: that.data.carts[index].id,
    })
    ajax.post(api.updateList, data, callback)
  },

  delete(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    let carts = that.data.carts;
    let callback = (data) => {
      carts.splice(index, 1);
      that.setData({
        carts: carts
      });
      if (!carts.length) {
        that.setData({
          hasList: false
        });
      } else {
        that.getTotalPrice();
      }
      app.getCartNum();
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    }
    let data = ({
      id: that.data.carts[index].id,
    })
    ajax.post(api.deleteCart, data, callback)

  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    let carts = that.data.carts;
    let callback = (data) => {
      carts.splice(index, 1);
      that.setData({
        carts: carts
      });
      if (!carts.length) {
        that.setData({
          hasList: false
        });
      } else {
        that.getTotalPrice();
      }
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    }
    let data = ({
      id: that.data.carts[index].id,
    })
    ajax.post(api.deleteCart, data, callback)
    
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0.00;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].goodsNum * carts[i].goodsPrice;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  //下单
  toOrder() {
    var that = this;
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    var cartIds = '';
    var cartIds = that.data.cartIds.split(',');
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                   // 判断是否选中
        cartIds += carts[i].id + ',';
        total = total + 1;
      }
    }
    if (total < 1) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (wx.getStorageSync('user').mobile == '' || wx.getStorageSync('user').mobile == null) {
      wx.showToast({
        title: '请先前往个人中心绑定手机号',
        icon: 'none',
        duration: 3000
      })
      return
    }
    // wx.request({
    //   url: api.orderCreate,
    //   method: 'POST',
    //   data: ({
    //     cartId: temp
    //   }),
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded', // 默认值
    //     'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
    //   },
    //   success(res) {
    //     var data = res.data
    //     if (data.code == 200) {
          wx.navigateTo({
            url: '../order/confirm?cartIds=' + cartIds,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀     
          })
    //     }
    //   }
    // });
  }

})