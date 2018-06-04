//usercenter.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    isHidden: true,
    isHiddenMore: true,
    userInfo: {},
    scan: '../../images/scan.png',
    recent: '../../images/recent.png',
    flag: '../../images/flag.png',
    close: '../../images/close.png',
    advertise: '../../images/advertise.png',
    ticket: '../../images/ticket.png',
    advise: '../../images/advise.png',
    joinus: '../../images/joinus.png',
    mine: '../../images/mine.png',
    index: '../../images/index1.png',
    poster: '../../images/poster.png',
    modalFlag: true,
    notice: '',
  },
// 加载完毕
  onLoad: function () {
    var that =this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    app.addUser(function (level) {
      //更新数据
      if (level > 0) {
        console.log("是管理员");
        that.setData({
          isHidden: false
        })
        if (level > 1){
          console.log("是高级管理员");
          that.setData({
            isHiddenMore: false
          })
        }
      }
    }) 
  },
  //你点了头像部分！
  bindUserInfo: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo'
    })
  },
  //点击我的活动！
  bindViewTap: function () {
    wx.navigateTo({
      url: '../myticket/myticket'
    })
  },
  // 打开新世界，发起活动
  launchActivity: function () {
    wx.navigateTo({
      url: '../edit/edit?a=0'
    })
  },
  // 打开我发起的页面
  showMine: function (e) {
    wx.navigateTo({
      url: '../icreate/icreate?id=' + e.currentTarget.id
    })
  },
  // 点击扫一扫
  scanningCode: function (event) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      }
    })
    wx.showModal({
      title: '提示：',
      content: '为保证准确定位，请确认手机是否已经打开GPS？',
      confirmText: '已打开',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              console.log(res.result);
              that.sign(res.result);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 签到
  sign: function (info) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'operateTicket',
      data: {
        method: 'sign',
        openid: util.openId,
        activityid: 5,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.showModal({
          title: res.data,
          showCancel: false,
          confirmText: '确定',
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '网络故障',
          showCancel: false,
          confirmText: '确定',
        })
      }
    })
  },
  // 弹出框动画
  showOpin: function () {
    wx.showModal({
      title: '意见反馈',
      content: '请将意见发送至：bit_xinxi@126.com（邮件主题注明意见反馈），我们的工作人员会第一时间给您反馈！',
      showCancel: false,
      confirmText: '好的',
    })
  },
  showJoin: function () {
    wx.navigateTo({
      url: "../detail/detail?a=1&id=31"
    })
  },
  showModal: function () {
    this.setData({
    modalFlag: false,
    notice: '隐藏对话',
    });
  },
  hideModal: function () {
    this.setData({
      modalFlag: true,
    });
  },
})