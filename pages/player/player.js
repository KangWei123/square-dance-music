Page({
  data: {
    currentMusic: null,
    isPlaying: false,
    currentTime: '0:00',
    duration: '0:00',
    progress: 0,
    speedOptions: [
      { label: '0.8x', value: 0.8 },
      { label: '1.0x', value: 1.0 },
      { label: '1.2x', value: 1.2 }
    ],
    currentSpeed: 1.0,
    volume: 80,
    isCollected: false
  },

  onLoad: function() {
    const app = getApp();
    const currentMusic = app.globalData.currentMusic || {
      title: '请选择音乐',
      artist: '暂无'
    };
    this.setData({
      currentMusic: currentMusic
    });
    this.initPlayer();
  },

  initPlayer: function() {
    const app = getApp();
    const backgroundAudioManager = app.globalData.backgroundAudioManager;

    // 监听播放状态
    backgroundAudioManager.onPlay(() => {
      console.log('音频开始播放');
      this.setData({ isPlaying: true });
    });

    backgroundAudioManager.onPause(() => {
      console.log('音频暂停');
      this.setData({ isPlaying: false });
    });

    backgroundAudioManager.onEnded(() => {
      console.log('音频播放结束');
      this.setData({ isPlaying: false });
      this.playNext();
    });

    backgroundAudioManager.onStop(() => {
      console.log('音频停止');
      this.setData({ isPlaying: false });
    });

    backgroundAudioManager.onTimeUpdate(() => {
      const currentTime = backgroundAudioManager.currentTime;
      const duration = backgroundAudioManager.duration || 0;
      const progress = (currentTime / duration) * 100;

      this.setData({
        currentTime: this.formatTime(currentTime),
        duration: this.formatTime(duration),
        progress: progress
      });
    });

    // 检查当前播放状态
    if (backgroundAudioManager.src && backgroundAudioManager.paused === false) {
      this.setData({ isPlaying: true });
    }

    // 设置初始音量
    backgroundAudioManager.volume = this.data.volume / 100;

    // 检查是否已收藏
    this.checkCollectStatus();
  },

  formatTime: function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  playPause: function() {
    const app = getApp();
    const backgroundAudioManager = app.globalData.backgroundAudioManager;
    const currentMusic = app.globalData.currentMusic;

    if (this.data.isPlaying) {
      backgroundAudioManager.pause();
    } else {
      // 确保使用正确的链接
      if (currentMusic && currentMusic.url) {
        backgroundAudioManager.src = currentMusic.url;
      }
      backgroundAudioManager.play();
    }
  },

  playPrev: function() {
    // 实现上一首逻辑
    wx.showToast({
      title: '上一首',
      icon: 'none'
    });
  },

  playNext: function() {
    // 实现下一首逻辑
    wx.showToast({
      title: '下一首',
      icon: 'none'
    });
  },

  playRandom: function() {
    // 实现随机播放逻辑
    wx.showToast({
      title: '随机播放',
      icon: 'none'
    });
  },

  playLoop: function() {
    // 实现循环播放逻辑
    wx.showToast({
      title: '循环播放',
      icon: 'none'
    });
  },

  changeSpeed: function(e) {
    const speed = e.currentTarget.dataset.speed;
    this.setData({ currentSpeed: speed });
    // 实现倍速调节逻辑
    wx.showToast({
      title: `倍速已调整为 ${speed}x`,
      icon: 'none'
    });
  },

  startVolumeChange: function(e) {
    // 开始调节音量
  },

  changeVolume: function(e) {
    const volumeBarWidth = e.currentTarget.offsetWidth;
    const touchX = e.touches[0].clientX - e.currentTarget.offsetLeft;
    let volume = (touchX / volumeBarWidth) * 100;
    volume = Math.max(0, Math.min(100, volume));

    this.setData({ volume: volume });
    const app = getApp();
    app.globalData.backgroundAudioManager.volume = volume / 100;
  },

  toggleCollect: function() {
    this.setData({ isCollected: !this.data.isCollected });
    wx.showToast({
      title: this.data.isCollected ? '收藏成功' : '取消收藏',
      icon: 'success'
    });
  },



  checkCollectStatus: function() {
    // 检查是否已收藏
    this.setData({ isCollected: false });
  }
})