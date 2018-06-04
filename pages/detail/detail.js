//join.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    activity:[],
    source1: '../../images/source1.png',
    type1: '../../images/type1.jpg',
    time: '../../images/time.png',
    spot: '../../images/spot.png',
    write: '../../images/write.png',
    mesShare: '../../images/mesShare.png',
    picShare: '../../images/picShare.png',
    back: '../../images/back.png',
    close: '../../images/close.png',
    poster:'',
    Url: app.globalData.url,
    QRPath: '',
    shareImgPath: '',
    windowWidth: 0,
    windowHeight: 0,
    modalFlag: true,
    joinCSS: 'background: #07c4d0;',
  },
  // 加载完后读取数据
  onLoad: function (options) {
    this.updateUser();
    this.getById(options.id);
    this.setData({
      windowWidth: wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight,
    })
  },
  //我要分享给朋友
  onShareAppMessage: function (res) {
    return {
      title: "报名链接：" + this.data.activity.title,
      path: "pages/detail/detail?a=1&id=" + this.data.activity.id,
      success: function (res) {
        console.log("转发成功")
      },
      fail: function (res) {
        console.log("转发失败")
      }
    }
  },
  // 返回首页
  toIndex: function (options) {
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 我要使用app的信息快速报名
  signUp: function (){
    var that = this;
    console.log(util.user.name);
    if (util.user.name && util.user.number && util.user.school && util.user.phone ){
      wx.request({
        url: app.globalData.url + 'operateTicket',
        data: {
          method: 'add',
          openid: util.openId,
          activityid: that.data.activity.id,
        },
        header: {
          //'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data == '报名成功') {
            wx.showModal({
              title: res.data,
              confirmText: '查看',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "../ticket/ticket?a=1&id=" + that.data.activity.id
                  })
                }
              }
            })
          } else {
            if (res.data == '您已报名'){
              wx.showModal({
                title: res.data,
                showCancel: false,
                confirmText: '确认',
              })
            }
            else {
              wx.showModal({
                title: res.data,
                showCancel: false,
                confirmText: '确认',
              })
            }
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
    }else {
      wx.showModal({
        title: "个人信息不全",
        confirmText: '前往',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "../userinfo/userinfo"
            })
          }
        }
      })
    }
    
  },
  // 刷新用户信息函数
  updateUser: function (){
    wx.request({
      url: app.globalData.url + 'operateUser',
      data: {
        method: 'get',
        openid: util.openId
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        util.user = res.data;
        console.log('刷新用户信息成功');
      },
      fail: function (res) {
        console.log("刷新用户信息失败")
      }
    })
  },
  //从服务器获取活动
  getById: function(optionId) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'operateActivity',
      data: {
        method: 'get',
        id: optionId,
        openId: util.openId,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          activity: res.data,
          poster: app.globalData.url + 'file/poster/' + res.data.date + '-' + res.data.title + '.jpg',
        });
        // 修改报名按钮颜色
        if (that.data.activity.bookState == '已报名') {
          that.setData({
            joinCSS: 'background: #999;',
          });
        }
        util.activity = res.data;
      },
      fail: function (res) {
        console.log("获取活动失败")
      }
    })
  },
  // 保存小程序码
  getQRcode: function () {
    var that = this;
    that.setData({
      modalFlag: false,
    })
    wx.downloadFile({
      url: app.globalData.url + 'file/qrcode/' + that.data.activity.id + '.png',
      success: function (res) {
        const ctx = wx.createCanvasContext('myCanvas');
        // 设置背景
        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, 500 / 750 * that.data.windowWidth, 700 / 750 *that.data.windowHeight);
        // 插入文字
        ctx.setFillStyle('black');
        ctx.setFontSize(0.045 * that.data.windowWidth);
        var iniHeight = 0.1 * 500 / 750 * that.data.windowWidth;
        var lastSubStrIndex = 0;
        var lineWidth = 0;
        var str = that.data.activity.title;
        for (let i = 0; i < str.length; i++) {
          if (i % 12 == 0){
            ctx.fillText(str.substring(lastSubStrIndex, i), 0.1 * 500 / 750 * that.data.windowWidth, iniHeight);
            iniHeight += 0.045 * that.data.windowWidth;
            lastSubStrIndex = i;
          }
          //绘制剩余部分
          if (i == str.length - 1) {
            ctx.fillText(str.substring(lastSubStrIndex, i + 1), 0.1 * 500 / 750 * that.data.windowWidth, iniHeight);
          }
        }
        ctx.setFontSize(0.03 * that.data.windowWidth)
        ctx.fillText('时间：' + that.data.activity.date + ' ' + that.data.activity.start + '-' + that.data.activity.end, 0.21 * 500 / 750 * that.data.windowWidth, 0.35 * that.data.windowWidth)
        ctx.fillText('地点：' + that.data.activity.place, 0.21 * 500 / 750 * that.data.windowWidth, 0.4 * that.data.windowWidth)
        // 插入图片
        ctx.drawImage(res.tempFilePath, 0.35 * 500 / 750 * that.data.windowWidth, 0.4 * 700 / 750 * that.data.windowHeight, 0.3 * 500 / 750 * that.data.windowWidth, 0.3 * 500 / 750 * that.data.windowWidth)
        console.log(res.tempFilePath);
        ctx.draw()
      }
    }) 
  },
  savePic: function () {
    var that = this;
    that.setData({
      modalFlag: true,
    })
    wx.canvasToTempFilePath({
      quality: 1,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '保存成功',
              content: '已保存至相册，离开小程序后记得发朋友圈哦~',
              showCancel: false,
              confirmText: '确认',
            })
          }
        })
      }
    })
  },
  // 关闭图片预览
  hideModal: function () {
    this.setData({
      modalFlag: true,
    });
  },
})
