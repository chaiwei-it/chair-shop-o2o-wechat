// 本机
var FACE_URl = 'http://127.0.0.1:9003/api/v1';



var api = {

  login: FACE_URl + '/login',
  register: FACE_URl + '/register',
  getLogin: FACE_URl + '/getLogin',
  // pLogin: SHOP_URl + '/loginapi/getLogin',

  // 商品信息
  indexGoodsList: FACE_URl + '/goods/indexList',
  classGoodsList: FACE_URl + '/goods/classList',
  selfGoodsList: FACE_URl + '/goods/selfGoodList',
  selectGoods: FACE_URl + '/goods/select',

  //推广码
  getQRCode: FACE_URl + '/code',
  getdetail: FACE_URl + '/api/v1/code/',

  // 商品分类信息
  goodsClassList: FACE_URl + '/goodsClass/list',

  //购物车
  addCart: FACE_URl + '/cart',
  cartList: FACE_URl + '/cart/list',
  updateList: FACE_URl + '/cart/update',
  getCartNum: FACE_URl + '/cart/cartNum',
  deleteCart: FACE_URl + '/cart/delete',
  getCartList: FACE_URl + '/cart/byIds',

  //banner
  bannerList: FACE_URl + '/banner/list',

  //地址
  addressList: FACE_URl + '/address/list',
  addressCreate: FACE_URl + '/address',
  addressUpdate: FACE_URl + '/address/update',
  addressDetails: FACE_URl + '/address/select',
  addressDelete: FACE_URl + '/address/delete',
  getDefaultAddress: FACE_URl + '/address/getDefaultAddress',


  
  //订单
  orderList: FACE_URl + '/order/list',
  orderCreate: FACE_URl + '/order',
  orderUpdate: FACE_URl + '/order/',
  orderDelete: FACE_URl + '/order/delete',
  orderDetails: FACE_URl + '/order/select',
  getOrderNum: FACE_URl + '/order/getOrderNum',
  cancel: FACE_URl + '/order/cancel',//取消订单
  finish: FACE_URl + '/order/finish',//确认收货

  //支付
  wxpay: FACE_URl + '/wxpay',
  wxpaySelect: FACE_URl + '/wxpay/select',
  // wxpayDetails: FACE_URl + '/wxpay',

  //手机号
  getMobile: FACE_URl + '/userRebate/getMobile',
  updateMobile: FACE_URl + '/userRebate/updateMobile',
  //发送验证码
  sendCode: FACE_URl + '/sms/sendCode',

  getUserRebate: FACE_URl + '/userRebate',

  //代理
  agentAdd: FACE_URl + '/agent',
  selfDetails: FACE_URl + '/agent/selfDetails',
  agentUpdate: FACE_URl + '/agent',
  getdetails: FACE_URl + '/agent/',
  agentPay: FACE_URl + '/agent/pay',

  //返利
  getRebateList: FACE_URl + '/rebate/getRebateList',
  getRebatePrice: FACE_URl + '/rebate/getRebatePrice',
  getRebate: FACE_URl + '/rebate/getRebate',

  //提现
  putforward: FACE_URl + '/putforward',
  getPutList: FACE_URl + '/putforward/getPutList',

  //会员
  getRebateUserList: FACE_URl + '/userRebate/getRebateUserList',
  getUserNum: FACE_URl + '/userRebate/getUserNum',
  getParentUser: FACE_URl + '/userRebate/getParentUser',
}
module.exports = api;