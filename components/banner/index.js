// components/order/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerList: Object
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
    toPage: function (e) {
      if (e.currentTarget.dataset.banner) {
        var banner = e.currentTarget.dataset.banner
        if (banner.relation == 1){
          wx.navigateTo({
            url: '/pages/goods/details?id=' + banner.content
          })
        }else if (banner.relation == 2) {
          wx.navigateTo({
            url: banner.content
          })
        } else if (banner.relation == 3) {
          wx.navigateTo({
            url: '/pages/image/index?images=' + banner.content
          })
        }
        
      }

    }
  }
})
