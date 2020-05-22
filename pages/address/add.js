import lib from '../../utils/lib.js'
const { api,ajax } = lib
var addresss = require('../../data/area')

const provinceName = []
const provinceCode = []
const provinceSelIndex = 0
const cityName = []
const cityCode = []
const citySelIndex = 0
const areaName = []
const areaCode = []
const areaSelIndex = 0

// 设置省的数据
var province = addresss['1000000']
for (var item in province) {
  provinceName.push(province[item])
  provinceCode.push(item)
}
// 设置市的数据
var city = addresss[provinceCode[0]]
for (var item in city) {
  cityName.push(city[item])
  cityCode.push(item)
}
// 设置区的数据
var area = addresss[cityCode[citySelIndex]]
for (var item in area) {
  areaName.push(area[item])
  areaCode.push(item)
}

Page({
  data: {
    //输入框
    value_provinceName: provinceName,
    value_provinceCode: provinceCode,
    value_provinceSelIndex: 0,
    value_cityName: cityName,
    value_cityCode: cityCode,
    value_citySelIndex: 0,
    value_areaName: areaName,
    value_areaCode: areaCode,
    value_areaSelIndex: 0,
    //选项中的值
    provinceName: provinceName,
    provinceCode: provinceCode,
    provinceSelIndex: 0,
    cityName: cityName,
    cityCode: cityCode,
    citySelIndex: 0,
    areaName: areaName,
    areaCode: areaCode,
    areaSelIndex: 0,
    showMessage: false,
    messageContent: '',
    showDistpicker: false,
    details:'',
    id:'',
    value: [0, 0, 0],
    showView: false
  },

  onLoad: function (options) {
    var that = this;
    that.setValueData()
    if (!(typeof (options.addressId) == "undefined")) {
      that.setData({
        id: options.addressId
      });
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      wx.request({
        url: api.addressDetails,
        method: 'POST',
        data: ({
          id: that.data.id
        }),
        header: {
          'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
          "Content-Type": "application/json;charset=UTF-8"
        },
        success(res) {
          var data = res.data
          if (data.code == 20000) {
            that.setData({
              details: data,
              defaultStatus: data.defaultStatus == 1 ?true:false,
              id: data.id,
              value_provinceSelIndex: data.provinceId,
              value_citySelIndex: data.cityId,
              value_areaSelIndex: data.areaId,
              provinceSelIndex: data.provinceId,
              citySelIndex: data.cityId,
              areaSelIndex: data.areaId,
              value: [data.provinceId, data.cityId, data.areaId]
            });
            that.setAreaData(data.provinceId, data.cityId, data.areaId)
            that.setValueData()
          }
        },
      });
    }else{
      that.setAreaData(provinceSelIndex, citySelIndex, areaSelIndex)
    }
  },

  onShow:function(){
    var that = this;
    that.setValueData();
  },

  onReady :function(){
    var that= this;
    var p = that.data.details.provinceId
    var c = that.data.details.cityId
    var d = that.data.details.areaId
    if (that.data.details != ''){
      that.setData({
        value_provinceSelIndex : p,
        value_citySelIndex : c,
        value_areaSelIndex : d,
        provinceSelIndex : p,
        citySelIndex : c,
        areaSelIndex : d,
      })
    }
    that.setData({
      showView: true
    })
  },

  // onLoad: function (options) {
  //   // 载入时要显示再隐藏一下才能显示数据，如果有解决方法可以在issue提一下，不胜感激:-)
  //   // 初始化数据
  //   this.setAreaData()
  // },
  setValueData: function () {
    var that = this;
    that.setData({
      value_provinceName: that.data.provinceName,
      value_provinceCode: that.data.provinceCode,
      value_areaName: that.data.areaName,
      value_areaCode: that.data.areaCode,
      value_cityName: that.data.cityName,
      value_cityCode: that.data.cityCode
    })
  },
  setAreaData: function (p, c, d) {
    var that = this;
    // 设置省的数据
    var province = addresss['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceName: provinceName,
      provinceCode: provinceCode
    })
    // 设置市的数据
    var city = addresss[provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityName: cityName,
      cityCode: cityCode
    })
    // 设置区的数据
    var area = addresss[cityCode[c]]
    var areaName = [];
    var areaCode = [];
    for (var item in area) {
      areaName.push(area[item])
      areaCode.push(item)
    }
    this.setData({
      areaName: areaName,
      areaCode: areaCode
    })
  },
  //滑动选项时触发
  changeArea: function (e) {
    var p = e.detail.value[0]
    var c = e.detail.value[1]
    var d = e.detail.value[2]
    this.setData({
      provinceSelIndex: p,
      citySelIndex: c,
      areaSelIndex: d
    })
    this.setAreaData(p, c, d)
  },
  //打开选项卡
  showDistpicker: function () {
    this.setData({
      showDistpicker: true
    })
  },
  //取消
  distpickerCancel: function () {
    this.setData({
      showDistpicker: false
    })
  },
  //确定
  distpickerSure: function () {
    var that = this
    that.setData({
      value_provinceSelIndex: that.data.provinceSelIndex,
      value_citySelIndex: that.data.citySelIndex,
      value_areaSelIndex: that.data.areaSelIndex
    })
    that.setValueData()
    that.distpickerCancel()
  },
  //提交数据
  savePersonInfo: function (e) {
    var that = this
    var data = e.detail.value
    var telRule = /^1[3|4|5|6|7|8]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (data.username == '') {
      this.showMessage('请输入姓名')
    } else if (!nameRule.test(data.username)) {
      this.showMessage('请输入中文名')
    } else if (data.mobile == '') {
      this.showMessage('请输入手机号码')
    } else if (data.province == '') {
      this.showMessage('请选择所在地区')
    } else if (data.city == '') {
      this.showMessage('请选择所在地区')
    } else if (data.area == '') {
      this.showMessage('请选择所在地区')
    } else if (data.address == '') {
      this.showMessage('请输入详细地址')
    } else {
      if (that.data.id == ''){
        let callback = (data) => {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({ changed: true });
          }, 1000) 
        }
        let parameter = ({
          username: data.username,
          mobile: data.mobile,
          provinceName: data.provinceName,
          cityName: data.cityName,
          areaName: data.areaName,
          provinceId: that.data.provinceSelIndex,
          cityId: that.data.citySelIndex,
          areaId: that.data.areaSelIndex,
          address: data.address,
          defaultStatus: data.defaultStatus ? 1 : 0,
        })
        ajax.post(api.addressCreate, parameter, callback)
      }else{
        let callback = (data) => {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({ changed: true });
          }, 1000)
        }
        let parameter = ({
          id: that.data.id,
          username: data.username,
          mobile: data.mobile,
          provinceName: data.provinceName,
          cityName: data.cityName,
          areaName: data.areaName,
          provinceId: that.data.provinceSelIndex,
          cityId: that.data.citySelIndex,
          areaId: that.data.areaSelIndex,
          address: data.address,
          defaultStatus: data.defaultStatus ? 1 : 0,
        })
        ajax.post(api.addressUpdate, parameter, callback)
      }
    } 
  },

  //公共提示框
  showMessage: function (text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function () {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 3000)
  },

  //删除当前地址
  delAddress:function(){
    console.log('进入删除')
    var that = this;
    wx.showModal({
      title: '确认',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: api.addressDelete,
            method: 'POST',
            data: ({
              id: that.data.id
            }),
            header: {
              'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
              "Content-Type": "application/json;charset=UTF-8"
            },
            success(res) {
              var data = res.data
              if (data.code == 20000) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.navigateBack({ changed: true });
                }, 1000)
              }
            }
          })
        }
      }
    })
    
  }

})
