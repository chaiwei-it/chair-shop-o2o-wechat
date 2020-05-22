// components/order/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPage: function () {
      wx.navigateTo({
        url: '/pages/order/details?id=' + this.data.order.id
      })
    },

    //取消订单
    toCancel: function(){
      wx.navigateTo({
        url: '/pages/order/details?id=' + this.data.order.id + '&cancelStatus=' + true
      })
    },

    //立即支付
    toPay: function () {
      wx.navigateTo({
        url: '/pages/order/details?id=' + this.data.order.id + '&payStatus=' + true
      })
    },

    //提醒发货
    toRemind: function () {
      wx.showToast({
        title: '已经提醒卖家发货，请耐心等待',
        icon: 'none',
        duration: 3000
      })
    },

    //查看物流
    toLogistics: function () {
      wx.navigateTo({
        url: '/pages/order/logistics?shippingCode=' + this.data.order.shippingCode
      })
    },

    //确认收货
    toConfirm: function () {
      wx.navigateTo({
        url: '/pages/order/details?id=' + this.data.order.id + '&confirmStatus=' + true
      })
    },

    //删除订单
    toDelete: function () {
      wx.navigateTo({
        url: '/pages/order/details?id=' + this.data.order.id + '&deleteStatus=' + true
      })
    },
    
  }
})
