
var util = {
  wait: function (time, callback) {
    var that = this
    callback()
    //递归做轮询
    setTimeout(function () {
      that.wait()
    }, time)
  },

  replace: function (oldUrl) {
    // var oldDoMain = 'shop-v1.oss-cn-beijing.aliyuncs.com';
    // var newDoMain = 'sz.cctvctr.com/download';
    // var newUrl = oldUrl.replace(oldDoMain, newDoMain);
    return oldUrl;
  },

  formatNumber: function(n) {
    n = n.toString()
    return n[1] ?n: '0' + n
  },

  formatTime: function (number, format){
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']; 
    var returnArr = []; 
    var date = new Date(number); 
    returnArr.push(date.getFullYear()); 
    returnArr.push(this.formatNumber(date.getMonth() + 1)); 
    returnArr.push(this.formatNumber(date.getDate())); 
    returnArr.push(this.formatNumber(date.getHours())); 
    returnArr.push(this.formatNumber(date.getMinutes())); 
    returnArr.push(this.formatNumber(date.getSeconds())); 
    for (var i in returnArr) { 
      format = format.replace(formateArr[i], returnArr[i]); 
    } 
    return format;

  }
}
module.exports = util;