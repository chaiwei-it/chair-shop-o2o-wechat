// components/order/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: String,
    src: String,
    url: String,
    num: Number
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
      if (this.properties.url) {
        wx.navigateTo({
          url: this.properties.url
        })
      }

    }
  }
})
