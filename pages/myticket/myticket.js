//myjoin.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    feed: [],
  },
  onLoad: function () {
    this.getMy();
  },
  //从服务器获取我的活动
  getMy: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'operateTicket',
      data: {
        method: 'getByOpenid',
        openid: util.openId,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        util.myActivities = util.cookData(res.data);
        // 读取活动
        that.setData({
          feed: util.myActivities,
        });
        console.log("成功获取我的活动");
      },
      fail: function (res) {
        console.log("获取我的活动失败");
      }
    })
  },
  bindTicket: function (e) {
    wx.navigateTo({
      url: "../ticket/ticket?a=2&id=" + e.currentTarget.id
    })
  },
  
})
