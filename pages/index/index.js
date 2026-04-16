Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'square', name: '广场舞' },
      { id: 'ghost', name: '鬼步舞' },
      { id: 'ballroom', name: '交谊舞' }
    ],
    rhythms: [
      { id: 'all', name: '全部' },
      { id: 'slow3', name: '慢三' },
      { id: 'slow4', name: '慢四' },
      { id: 'fast3', name: '快三' },
      { id: 'fast4', name: '快四' }
    ],
    selectedCategory: 'all',
    selectedRhythm: 'all',
    musicList: [],
    collectList: []
  },

  onLoad: function() {
    this.initData();
  },

  initData: function() {
    // 模拟音乐数据
    const mockMusicList = [
      {
        id: '1',
        title: '最炫民族风',
        artist: '凤凰传奇',
        duration: '3:45',
        category: 'square',
        rhythm: 'fast4',
        url: 'https://636c-cloud1-9gon47lr177773ed-1422719685.tcb.qcloud.la/music/%E6%9C%80%E7%82%AB%E6%B0%91%E6%97%8F%E9%A3%8E.mp3?sign=34f38b6f24c1d7cae499f7337c0a9376&t=1776332041',
        isPlaying: false,
        isCollected: false
      },
      {
        id: '2',
        title: '小苹果',
        artist: '筷子兄弟',
        duration: '3:33',
        category: 'square',
        rhythm: 'fast4',
        url: 'https://636c-cloud1-9gon47lr177773ed-1422719685.tcb.qcloud.la/music/%E5%B0%8F%E8%8B%B9%E6%9E%9C.mp3?sign=f78fbcd853eb1811bd07224b4a355758&t=1776332021',
        isPlaying: false,
        isCollected: false
      }
    ];

    this.setData({
      musicList: mockMusicList
    });
  },

  selectCategory: function(e) {
    this.setData({
      selectedCategory: e.currentTarget.dataset.id
    });
    // 这里可以添加过滤逻辑
  },

  selectRhythm: function(e) {
    this.setData({
      selectedRhythm: e.currentTarget.dataset.id
    });
    // 这里可以添加过滤逻辑
  },

  playMusic: function(e) {
    const music = e.currentTarget.dataset.music;
    const app = getApp();
    const backgroundAudioManager = app.globalData.backgroundAudioManager;

    // 停止其他音乐
    this.data.musicList.forEach(item => {
      item.isPlaying = false;
    });

    // 显示加载提示
    wx.showLoading({
      title: '加载音乐中...',
      mask: true
    });

    // 播放当前音乐
    backgroundAudioManager.title = music.title;
    backgroundAudioManager.src = music.url;
    
    // 添加错误监听
    backgroundAudioManager.onError(function(err) {
      console.error('播放错误:', err);
      wx.hideLoading();
      wx.showToast({
        title: '播放失败，错误：' + err.errMsg,
        icon: 'none'
      });
    });

    // 添加可以播放监听
    backgroundAudioManager.onCanplay(function() {
      console.log('音乐可以播放');
      wx.hideLoading();
      backgroundAudioManager.play();
    });

    // 更新状态
    music.isPlaying = true;
    app.globalData.currentMusic = music;
    this.setData({
      musicList: this.data.musicList
    });

    // 跳转到播放器页面
    wx.navigateTo({
      url: '../player/player'
    });
  },

  toggleCollect: function(e) {
    const id = e.currentTarget.dataset.id;
    const musicList = this.data.musicList;
    const music = musicList.find(item => item.id === id);
    music.isCollected = !music.isCollected;
    this.setData({
      musicList: musicList
    });

    // 管理收藏列表
    let collectList = wx.getStorageSync('collectList') || [];
    if (music.isCollected) {
      // 添加到收藏列表
      if (!collectList.some(item => item.id === id)) {
        collectList.push({
          id: music.id,
          title: music.title,
          artist: music.artist,
          duration: music.duration,
          category: music.category,
          rhythm: music.rhythm,
          url: music.url,
          isPlaying: false
        });
      }
    } else {
      // 从收藏列表中移除
      collectList = collectList.filter(item => item.id !== id);
    }
    
    // 更新本地存储
    wx.setStorageSync('collectList', collectList);

    wx.showToast({
      title: music.isCollected ? '收藏成功' : '取消收藏',
      icon: 'success'
    });
  },

  startVoice: function() {
    wx.showModal({
      title: '语音点歌',
      content: '请说出您想播放的歌曲名称，例如：播放广场舞最炫民族风',
      success: res => {
        if (res.confirm) {
          wx.startRecord({
            success: res => {
              const tempFilePath = res.tempFilePath;
              // 这里可以调用语音识别接口
              wx.showToast({
                title: '识别中...',
                icon: 'loading'
              });
              
              // 模拟语音识别结果
              setTimeout(() => {
                wx.showToast({
                  title: '正在播放：最炫民族风',
                  icon: 'success'
                });
              }, 1000);
            },
            fail: res => {
              wx.showToast({
                title: '录音失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  }
})