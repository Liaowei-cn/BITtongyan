//ticket.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    activity: [],
    user: [],
    qrcode: app.globalData.url + 'file/qrcode/',
    background: "#228B22",
    text: '退出活动',
    right: '../../images/right.png',
  },
  // 加载完后读取数据
  onLoad: function (options) {
    if(options.a==1){
      this.setData({
        activity: util.activity,
        user: util.user,
      });
    }
    else{
      this.setData({
        activity: util.getMyDataById(options.id),
        user: util.user,
      });
    } 
  },
  // 活动详情
  bindJoin: function () {
    wx.navigateTo({
      url: "../join/join?a=2&id=" + this.data.activity.id
    })
  },
  // 退出活动
  deleteTicket: function (){
    var that = this;
    wx.showModal({
      title: "确认退出该活动？",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + 'operateTicket',
            data: {
              method: 'delete',
              openid: util.openId,
              activityid: that.data.activity.id,
            },
            header: {
              //'Content-Type': 'application/json'
            },
            success: function (res) {
              if (res.data == 1) {
                that.setData({
                  background: "#999",
                  text: '票已作废',
                });
                wx.showToast({
                  title: '退票成功',
                  icon: 'sucess',
                  duration: 1000
                })
              } else {
                wx.showModal({
                  title: "退票失败~",
                  confirmText: '好吧',
                  showCancel: false,
                })
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "网络故障",
                confirmText: '确认',
                showCancel: false,
              })
            }
          })
        }
      }
    })
  },
  // 保存小程序码
  downQRcode: function () {
    var that = this;
    wx.downloadFile({
      url: app.globalData.url + 'file/qrcode/' + that.data.activity.id + '.png',
      success: function (res) {
        if (res.statusCode === 200) {
          var filePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              wx.showModal({
                title: '保存成功',
                content: '小程序码成功保存到相册了，记得发圈哦~',
                showCancel: false,
                confirmText: '确定',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  }
                }
              })
            },
          })
        }
      }
    })
  },
  // 跳转门票中心
  toTickets: function () {
    wx.navigateTo({
      url: "../myticket/myticket"
    })
  },
})
