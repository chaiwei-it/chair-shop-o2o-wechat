var util = {

  replace:function(oldUrl){
    var oldDoMain = 'shop-v1.oss-cn-beijing.aliyuncs.com';
    var newDoMain = 'sz.cctvctr.com/download';
    var newUrl = oldUrl.replace(oldDoMain, newDoMain);
    return newUrl;
  }
 
}
module.exports = util;