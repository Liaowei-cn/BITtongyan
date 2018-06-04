
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    userInfo: {},
    school: ['宇航学院', '机电学院', '机械与车辆学院', '光电学院', '信息与电子学院/微电子学院', '自动化学院', '计算机学院', '材料学院', '化学与化工学院', '生命学院', '数学与统计学院', '物理学院', '管理与经济学院', '人文与社会科学学院', '马克思主义学院', '法学院', '外国语学院', '设计与艺术学院', '其他学院'],
    indexSchool: 0,
    name: '',
    stuID: '',
    phone: '',
    disableEdit: true,
    borderCSS: 'color: #999; font-size: 16px;',
    button1CSS: 'color: #000;',
    button2CSS: 'color: #bbb;',
    disable1: false,
    disable2: true,
  },
  // 获取头像
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
      })
    })
    that.setData({
      name: util.user.name,
      stuID: util.user.number,
      phone: util.user.phone,
    })
    for (var i = 0; i < this.data.school.length; i++) {
      if (this.data.school[i] == util.user.school) {
        that.setData({
          indexSchool: i,
        })
      }
    }
  },
  // 编辑状态切换
  editChange: function (e) {
    console.log('点了编辑');
    this.setData({
      button1CSS: 'color: #bbb;',
      button2CSS: 'color: #000;',
      disable1: true,
      disable2: false,
      borderCSS: 'color: #000; font-size: 17px;',
      disableEdit: false,
    })
  },
  saveEdit: function (e) {
    this.formSubmit(e);
    console.log('点了保存');
    this.setData({
      button1CSS: 'color: #000;',
      button2CSS: 'color: #bbb;',
      disable1: false,
      disable2: true,
      borderCSS: 'color: #999; font-size: 16px;',
      disableEdit: true,
    })
  },
  // 修改个人信息
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    formData.method = 'update';
    formData.openid = util.openId;
    formData.school = that.data.school[that.data.indexSchool];
    console.log(formData);
    wx.request({
      url: app.globalData.url + 'operateUser',
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data == 1){
          that.getUser();
          wx.showToast({
            title: '修改成功',
            icon: 'sucess',
            duration: 1000
          })
        }
        else{
          wx.showModal({
            title: "修改失败~",
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
  }, 
  // 刷新用户信息
  getUser: function (req) {
    var that = this;
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
        console.log(res.data);
        console.log('刷新用户信息成功');
      },
      fail: function (res) {
        console.log("刷新用户信息失败")
      }
    })
  },

  bindSchoolChange: function (e) {
    console.log('发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexSchool: e.detail.value,
    })
  },

})
