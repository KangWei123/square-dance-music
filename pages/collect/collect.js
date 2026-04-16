Page({
  data: {
    collectList: [],
    playlistName: '我的广场舞歌单'
  },

  onLoad: function() {
    this.initData();
  },

  initData: function() {
    // 从本地存储中读取收藏数据
    const collectList = wx.getStorageSync('collectList') || [];
    this.setData({
      collectList: collectList
    });
  },

  playMusic: function(e) {
    const music = e.currentTarget.dataset.music;
    const app = getApp();
    const backgroundAudioManager = app.globalData.backgroundAudioManager;

    // 停止其他音乐
    this.data.collectList.forEach(item => {
      item.isPlaying = false;
    });

    // 播放当前音乐
    backgroundAudioManager.title = music.title;
    backgroundAudioManager.src = music.url;
    backgroundAudioManager.play();

    // 更新状态
    music.isPlaying = true;
    app.globalData.currentMusic = music;
    this.setData({
      collectList: this.data.collectList
    });

    // 跳转到播放器页面
    wx.navigateTo({
      url: '../player/player'
    });
  },

  removeCollect: function(e) {
    const id = e.currentTarget.dataset.id;
    const collectList = this.data.collectList.filter(item => item.id !== id);
    this.setData({
      collectList: collectList
    });

    // 更新本地存储
    wx.setStorageSync('collectList', collectList);

    wx.showToast({
      title: '已从收藏中移除',
      icon: 'success'
    });
  },

  renamePlaylist: function() {
    wx.showModal({
      title: '重命名歌单',
      content: '请输入新的歌单名称',
      inputValue: this.data.playlistName,
      success: res => {
        if (res.confirm) {
          this.setData({
            playlistName: res.inputValue
          });
          wx.showToast({
            title: '歌单已重命名',
            icon: 'success'
          });
        }
      }
    });
  },

  deletePlaylist: function() {
    wx.showModal({
      title: '删除歌单',
      content: '确定要删除歌单吗？',
      success: res => {
        if (res.confirm) {
          this.setData({
            collectList: []
          });
          wx.showToast({
            title: '歌单已删除',
            icon: 'success'
          });
        }
      }
    });
  }
})