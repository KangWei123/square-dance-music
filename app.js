App({
  onLaunch: function() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloud1-9gon47lr177773ed',
      traceUser: true
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    });

    // 初始化播放器
    this.globalData.backgroundAudioManager = wx.getBackgroundAudioManager();
  },

  globalData: {
    userInfo: null,
    backgroundAudioManager: null,
    currentMusic: null,
    musicList: [],
    collectList: []
  }
})