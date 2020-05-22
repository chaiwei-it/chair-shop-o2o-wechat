// components/order/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    curtainStatus: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    curtainStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideCurtain: function (e) {
      this.setData({
        curtainStatus: false
      })
    }
  }
})
