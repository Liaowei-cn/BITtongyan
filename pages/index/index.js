//index.js

var util = require('../../utils/util.js')
var app = getApp()
var activityNumber = 10
Page({
  data: {
    feed: [],
    isHideLoadMore:true,
    key: '',
    time: '../../images/time.png',
    search: '../../images/search.png',
    source1: '../../images/source1.png',
    loading: '../../images/loading.png',
    hideLoading: true,
    logoUrl: app.globalData.url,
  },
  //页面初始化最近10个活动
  onLoad: function () {
    this.update();
  },
  //点击卡片，跳转到活动详情页
  bindDetail: function (e) {
    wx.navigateTo({
      url: "../detail/detail?a=1&id=" + e.currentTarget.id
    })
  },
  // 首页下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    // 请求数据
    this.update();
    //延时关闭刷新动画
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000);
  },
  // 到底部加载更多
  ReachBottom: function () {
    activityNumber = activityNumber + 10;
    this.getMore(activityNumber);
  },
  // 加载中动画
  showLoading: function () {
    this.setData({
      hideLoading: false,
    })
  },
  hideLoading: function () {
    this.setData({
      hideLoading: true,
    })
  },
  //从服务器刷新前10个活动
  update: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getAcitivity',
      data: {
        start:0,
        num: 10,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('刷新成功');
        util.activities = util.cookData(res.data);
        // 读取活动
        that.setData({
          feed: util.activities,
        });
      },
      fail: function (res) {
        console.log("刷新成功")
      }
    })
  },
  //从服务器追加10个活动
  getMore: function(req){
    var that = this;
    that.showLoading();
    wx.request({
      url: app.globalData.url + 'getAcitivity',
      data: {
        start: 0,
        num: req,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('加载成功');
        util.activities = util.cookData(res.data);
        // 读取活动
        that.setData({
          feed: util.activities,
        });
      },
      fail: function (res) {
        console.log("加载失败")
      }
    })
    setTimeout(function () {
      that.hideLoading();
    }, 1000);
  },
  // 搜索框输入值
  keyInput: function (e) {
    this.setData({
      key: e.detail.value
    })
  },

  //搜索请求
  search: function(){
    var that = this;
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 1000
    }) 
    wx.request({
      url: app.globalData.url + 'searchAcitivity',
      data: {
        key: that.data.key,
      },
      header: {
        //'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('搜索成功');
        util.activities = util.cookData(res.data);
        // 读取活动
        that.setData({
          feed: util.activities,
        });
        wx.showToast({
          title: '搜索完成',
          icon: 'sucess',
          duration: 1000
        })
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
  //我要分享给朋友
  onShareAppMessage: function (res) {
    return {
      title: '「研途有理」 活动广场',
      path: 'pages/index/index',
      success: function (res) {
        console.log("转发成功")
      },
      fail: function (res) {
        console.log("转发失败")
      }
    }
  },
  
})