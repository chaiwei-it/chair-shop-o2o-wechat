// components/recommend/index.js
Component({

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    name: String,
    src: String,
    toName: String,
    url:String,
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
      if(this.properties.url){
        wx.navigateTo({
          url: this.properties.url
        })
      }
      
    }
  }
})
