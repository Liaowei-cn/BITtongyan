
var activities = [];
var myActivities = [];
var activity = [];
var myActivity = [];
var myCreate = [];
var user = [];
var openId = null;

// 查询时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 格式化编号
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// request让我用id找活动
function getDataById(id) {
  this.activities.forEach(function (v, i) {
    if (v.id == id) {
      activity = v;  
    }
  })
  return activity;
}
// request让我用id找我的活动
function getMyDataById(id) {
  this.myActivities.forEach(function (v, i) {
    if (v.id == id) {
      myActivity = v;
    }
  })
  return myActivity;
}
// 标记状态和进度条颜色
function cookData(raw){
  var nowTime = new Date();
  raw.forEach(function (v, i) {
    var tempStartTime = (v.date + ' ' + v.start).replace(/-/g, "/");
    var tempEndTime = (v.date + ' ' + v.end).replace(/-/g, "/");
    var startTime = new Date(tempStartTime);
    var endTime = new Date(tempEndTime);
    console.log(startTime);
    console.log(endTime);
    console.log(nowTime);
    if (nowTime <= startTime){
      v.state = "报名中";
      v.ticketState = "未开始";
      v.barColor = '#0fb50b';
      v.numColor = '#cc3300';
    }else {
      if (nowTime >= startTime && nowTime <= endTime) {
        v.state = "进行中";
        v.ticketState = "进行中";
        v.barColor = 'red';
        v.numColor = 'red';
      }else {
        v.state = "已结束";
        v.ticketState = "已过期";
        v.barColor = 'darkgray';
        v.numColor = 'darkgray';
      }
    }
  })
  return raw;
}




// 对外接口
module.exports = {
  formatTime: formatTime
};
module.exports.getDataById = getDataById;
module.exports.getMyDataById = getMyDataById;
module.exports.cookData = cookData;