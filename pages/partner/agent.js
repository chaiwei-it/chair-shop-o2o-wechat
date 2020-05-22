import lib from '../../utils/lib.js'
const { api } = lib
var region = require('../../data/area')

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
var province = region['1000000']
for (var item in province) {
  provinceName.push(province[item])
  provinceCode.push(item)
}
// 设置市的数据
var city = region[provinceCode[0]]
for (var item in city) {
  cityName.push(city[item])
  cityCode.push(item)
}
// 设置区的数据
var area = region[cityCode[citySelIndex]]
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
    details: '',
    id: '',
    value: [0, 0, 0],
    showView: false,
    grade: 1
  },

  onLoad: function (options) {
    if (options.grade) {
      this.setData({
        grade: options.grade,
      });
    }
    var that = this;
    that.setValueData()
    that.getAgent();
  },

  getAgent:function(){
    var that = this;
    that.setAreaData(provinceSelIndex, citySelIndex, areaSelIndex)
    wx.request({
      url: api.selfDetails,
      data: {
        grade: that.data.grade
      },
      header: {
        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var data = res.data
        if (data.code == 20000) {
          if(data.data[0].id != null){
          console.log(data.data[0].id)
            that.setData({
              details: data.data[0],
              id: data.data[0].id,
              value_provinceSelIndex: data.data[0].provinceId,
              value_citySelIndex: data.data[0].cityId,
              value_areaSelIndex: data.data[0].areaId,
              provinceSelIndex: data.data[0].provinceId,
              citySelIndex: data.data[0].cityId,
              areaSelIndex: data.data[0].areaId,
              value: [data.data[0].provinceId, data.data[0].cityId, data.data[0].areaId]
            });
            that.setAreaData(data.data[0].provinceId, data.data[0].cityId, data.data[0].areaId)
            that.setValueData()
          }else{
            // console.log("123")
            // that.setAreaData(provinceSelIndex, citySelIndex, areaSelIndex)
          }
        }
      },
    });
  },

  onShow: function () {
    var that = this;
    that.setValueData();
  },

  onReady: function () {
    var that = this;
    var p = that.data.details.provinceId
    var c = that.data.details.cityId
    var d = that.data.details.areaId
    if (that.data.details != '') {
      that.setData({
        value_provinceSelIndex: p,
        value_citySelIndex: c,
        value_areaSelIndex: d,
        provinceSelIndex: p,
        citySelIndex: c,
        areaSelIndex: d,
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
    var province = region['100000']
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
    var city = region[provinceCode[p]]
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
    var area = region[cityCode[c]]
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
    console.log(that.data.value_areaSelIndex);
    that.setValueData()
    that.distpickerCancel()
  },
  //提交数据
  savePersonInfo: function (e) {
    var data = e.detail.value
    if (data.username == '') {
      this.showMessage('请输入姓名')
    } else if (data.mobile == '') {
      this.showMessage('请输入手机号码')
    } else if (data.cardNum == '') {
      this.showMessage('请输入身份证号码')
    } else if (data.province == '') {
      this.showMessage('请选择所在地区')
    } else if (data.city == '') {
      this.showMessage('请选择所在地区')
    } else if (data.area == '') {
      this.showMessage('请选择所在地区')
    } else if (data.details == '') {
      this.showMessage('请输入详细地址')
    } else {
      var that = this
      if(that.data.id == ''){
        wx.request({
          url: api.agentAdd,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded', // 默认值
            'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
          },
          data: ({
            username: data.username,
            mobile: data.mobile,
            cardNum: data.cardNum,
            province: data.province,
            city: data.city,
            area: data.area,
            provinceId: that.data.provinceSelIndex,
            cityId: that.data.citySelIndex,
            areaId: that.data.areaSelIndex,
            details: data.details,
            grade:that.data.grade
          }),
          success(res) {
            var data = res.data
            if (data.code == 20000) {
              that.setData({
                id: data.data[0].id
              })
              that.toUrl()
            }
          }
        });
      }else{
        wx.request({
          url: api.agentUpdate,
          method: 'PUT',
          header: {
            'content-type': 'application/x-www-form-urlencoded', // 默认值
            'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
          },
          data: ({
            id:that.data.id,
            username: data.username,
            mobile: data.mobile,
            cardNum: data.cardNum,
            province: data.province,
            city: data.city,
            area: data.area,
            provinceId: that.data.provinceSelIndex,
            cityId: that.data.citySelIndex,
            areaId: that.data.areaSelIndex,
            details: data.details,
            grade: that.data.grade
          }),
          success(res) {
            var data = res.data
            if (data.code == 20000) {
              that.toUrl()
            }
          }
        });
      }
    }
  },

  toUrl:function(){
    var that = this
    // if(that.data.grade == 2){
      wx.navigateTo({
        url: './pay?id=' + that.data.id
      })
    // } else if (that.data.grade == 3){
    //   wx.navigateTo({
    //     url: './paycode'
    //   })
    // }
  },

  //公共提示框
  showMessage: function (text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },

})
