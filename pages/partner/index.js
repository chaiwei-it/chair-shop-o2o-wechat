import lib from '../../utils/lib.js'
const { ajax, api } = lib
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip:[
      '限时:499升级为商城VIP会员/终身权益',
      '分享权益:每分享一笔订单均有6%---18%的收益',
      '推荐权益:每推荐一个VIP会员均有10%的佣金',
      '4999礼包:成为VIP会员,送价值4999的创业礼包',
      '免费包邮:平台任意一款产品全国包邮',
      '专属客服:专属客服服务,一对一指导'
    ],
    agent: [
      '限时:4999升级为商城BOSS/终身权益',
      '分享权益:每分享一笔订单均有15%---21%的收益',
      '推荐权益:每推荐一个VIP会员均有10%-20%以上的佣金',
      '4999礼包:成为VIP会员,送价值4999的创业礼包',
      '免费包邮:平台任意一款产品全国包邮',
      '专属客服:专属客服服务,一对一,创业及售后指导',
      '开店扶持:实体开店费用全免扶持'
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLogin()
  },

  getLogin: function () {
    var that = this;
    let callback = (data) => {
      if (data.code == 20000) {
        that.setData({
          user: data.data[0].user,
          grade: data.data[0].user.grade
        })
        wx.setStorageSync('user', data.data[0].user)
      }
    }
    let data = ({
      keywords: 'index'
    })
    ajax.post(api.getLogin, data, callback)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})