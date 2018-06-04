
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    activity:[],
    method:'add',
    button:'发起活动',
    arrayOrganizer: ['校研究生会', '校学生会', '宇航学院', '机电学院', '机械与车辆学院', '光电学院', '信息与电子学院/微电子学院', '自动化学院', '计算机学院', '材料学院', '化学与化工学院', '生命学院', '数学与统计学院', '物理学院', '管理与经济学院', '人文与社会科学学院', '马克思主义学院', '法学院', '外国语学院', '设计与艺术学院'],
    indexOrganizer: 0,
    arrayType: ['学术讲座', '学科竞赛', '社团活动', '招新报名','活动抢票'],
    indexType: 0,
    date: '2018-01-01',
    start: '09:00',
    end: '11:00',
    right: '../../images/right.png',
    tempFilePaths: '',
    posterState: '选择图片',
  },
  // 加载完后读取数据
  onLoad: function (options) {
    // 读取本地活动数据
    if (options.a == 1) {
      this.setData({
        activity: util.getDataById(options.id),
        button: '确认修改',
        method: 'update',
      })
      this.patchActivity();
    }
  },
  patchActivity: function () {
    this.setData({
      indexOrganizer: 1,
      indexType: 1,
      date: this.data.activity.date,
      start: this.data.activity.start,
      end: this.data.activity.end,
    })
    for (var i = 0; i < this.data.arrayOrganizer.length; i++) {
      if (this.data.arrayOrganizer[i] == this.data.activity.organizer) {
        this.setData({
          indexOrganizer: i,
        })
      }
    }
    for (var i = 0; i < this.data.arrayType.length; i++) {
      if (this.data.arrayType[i] == this.data.activity.type) {
        this.setData({
          indexType:  i,
        })
      }
    }
  },
  // 获取输入值函数群
  bindOrganizerChange: function (e) {
    console.log('发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexOrganizer: e.detail.value
    })
  },
  bindTypeChange: function (e) {
    console.log('发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexType: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindStartChange: function (e) {
    console.log('发送选择改变，携带值为', e.detail.value)
    this.setData({
      start: e.detail.value
    })
  },
  bindEndChange: function (e) {
    console.log('发送选择改变，携带值为', e.detail.value)
    this.setData({
      end: e.detail.value
    })
  },
  // 获取海报手机位置
  uploadPoster: function() {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
          posterState: '已选择',
        })
      }
    })
  }, 
  // 修改活动信息
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    formData.openid = util.openId;
    formData.organizer = this.data.arrayOrganizer[this.data.indexOrganizer];
    formData.type = this.data.arrayType[this.data.indexType];
    formData.date = this.data.date;
    formData.start = this.data.start;
    formData.end = this.data.end;
    // 上传图片
    wx.uploadFile({
      url: app.globalData.url + 'upload',
      filePath: that.data.tempFilePaths[0],
      name: 'file',
      formData: {
        'filename': formData.date + '-' + formData.title,
      },
      success: function (res) {
        console.log('图片上传成功');
      }
    })
    // 更新活动
    if(util.user.level > 0){
      if (this.data.method == 'add') {
        that.addActivity(formData);
      }
      else {
        that.updateActivity(formData);
      }
    } 
  }, 
  // 修改活动
  updateActivity: function (formData){
    formData.method = 'update';
    formData.id = this.data.activity.id;
    wx.request({
      url: app.globalData.url + 'operateActivity',
      data: formData,
      header: {
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'sucess',
            duration: 1000
          })
        } else {
          wx.showModal({
            title: "活动修改失败~",
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
  // 新建活动
  addActivity: function (formData) {
    formData.method = 'add';
    wx.request({
      url: app.globalData.url + 'operateActivity',
      data: formData,
      header: {
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data != null && res.data != 0 ) {
          wx.showToast({
            title: '发布成功',
            icon: 'sucess',
            duration: 1000
          })
        } else {
          wx.showModal({
            title: "活动发布失败~",
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
        console.log(util.user);
        console.log('用户信息刷新成功');
      },
      fail: function (res) {
        console.log("网络故障")
      }
    })
  },

})
