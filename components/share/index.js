// components/order/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageUrl: String
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
    toImage: function () {
      var that = this;
      wx.getSetting({
        success: (res) => {
          if (typeof res.authSetting['scope.writePhotosAlbum'] == 'undefined') {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                that.toImage()
              }
            })
          } else if (res.authSetting['scope.writePhotosAlbum']) {
            wx.saveImageToPhotosAlbum({
              filePath: that.data.imageUrl,
              success(res) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail(e) {

              }
            })
          } else {
            wx.showModal({
              title: '保存失败',
              content: '获取保存到相册权限,请先前往设置中心设置',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                    }
                  })
                } else if (res.cancel) {
                  wx.showToast({
                    title: '取消将无法保存图片',
                    icon: 'success',
                    duration: 2000
                  })
                }
              }
            })
          }
        }
      })
    },
  }
})
