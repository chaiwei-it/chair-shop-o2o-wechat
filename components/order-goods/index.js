// components/recommend/index.js
Component({

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  
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
    toPage: function (e) {
      if (e.currentTarget.dataset.id) {
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
          url: '../goods/details?id=' + e.currentTarget.dataset.id
        })
      }
    }
  }
})
