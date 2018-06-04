//icreate.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    feed: [],
    time: '../../images/time.png',
    spot: '../../images/spot.png',
    isHidden: true,
  },
  onLoad: function (options) {
    var that = this;
    if (options.id == 1) {
      console.log("执行了");
      that.getMy();
    }
    else {
      that.setData({
        feed: util.activities,
        isHidden: false,
      });
    } 
  },
  //从服务器获取我的活动
  getMy: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'operateActivity',
      data: {
        method: 'getMyCreate',
        openid: util.openId,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        util.myCreate = util.cookData(res.data);
        // 读取活动
        that.setData({
          feed: util.myCreate,
        });
        console.log("成功获取我的活动");
      },
      fail: function (res) {
        console.log("获取我的活动失败");
      }
    })
  },
  //点击卡片，跳转到活动详情页
  bindDetail: function (e) {
    wx.navigateTo({
      url: "../detail/detail?a=1&id=" + e.currentTarget.id
    })
  },
  // 下载名单
  DownloadList: function (e) {
    // 请求生成表格
    wx.request({
      url: app.globalData.url + 'operateTicket',
      data: {
        method: 'getList',
        activityid: e.currentTarget.id,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data == '成功生成') {
          wx.downloadFile({
            url: app.globalData.url + "file/excel/" + e.currentTarget.id +".xls",
            success: function (res) {
              if (res.statusCode === 200) {
                var filePath = res.tempFilePath;
                wx.openDocument({
                  filePath: filePath,
                  fileType: 'xls',
                  success: function (res) {
                    console.log('打开文档成功')
                  }
                })
              } 
            }
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "网络故障",
          confirmText: '确认',
        })
      }
    })
  },
  // 编辑活动
  bindEdit: function (e) {
    wx.navigateTo({
      url: '../edit/edit?a=1&id=' + e.currentTarget.id,
    })
  },
  // 删除活动
  bindDelete: function (e) {
    var that = this;
    wx.showModal({
      title: "确认删除该活动？",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + 'operateActivity',
            data: {
              method: 'delete',
              id: e.currentTarget.id,
            },
            header: {
              // 'Content-Type': 'application/json'
            },
            success: function (res) {
              if (res.data == 1) {
                that.getMy();
                wx.showModal({
                  title: "活动删除成功！",
                  confirmText: '好的',
                  showCancel: false,
                })
              } else {
                wx.showModal({
                  title: "活动删除失败~",
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
})
