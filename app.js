//app.js 
var util = require('utils/util.js')

App({
  globalData: {
    userInfo: null,
    // url:"http://127.0.0.1:8080/app/",
    url: "https://www.bitdtcs.top/",
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.addUser();
  },
  // 获取openid并注册用户
  addUser: function (cb) {
    var that = this;
    wx.login({
      success: function (loginCode) {
        //调用request请求api转换登录凭证  
        wx.request({
          url: that.globalData.url + 'operateUser',
          data: {
            method: 'add',
            js_code: loginCode.code,
          },
          success: function (res) {
            console.log('注册用户成功');
            util.openId = res.data;
            // 获取用户信息
            wx.request({
              url: that.globalData.url + 'operateUser',
              data: {
                method: 'get',
                openid: util.openId
              },
              header: {
                //'Content-Type': 'application/json'
              },
              success: function (res) {
                console.log("获取用户信息成功")
                util.user = res.data;
                typeof cb == "function" && cb(util.user.level);
              },
              fail: function (res) {
                console.log("获取用户信息失败")
              }
            })
          }
        })
      }
    })
  },
  // 获取用户信息
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  
})
