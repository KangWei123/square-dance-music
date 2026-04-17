Page({
  data: {
    musicList: [],
    originalMusicList: [], // 原始音乐列表
    collectList: [],
    searchKeyword: '' // 搜索关键词
  },

  onLoad: function() {
    this.initData();
  },

  initData: function() {
    // 显示加载提示
    wx.showLoading({
      title: '加载音乐列表...',
      mask: true
    });

    // 从接口获取音乐数据
    wx.request({
      url: 'http://localhost:3000/api/music',
      method: 'GET',
      success: res => {
        console.log('获取音乐列表成功:', res.data);
        
        // 处理接口返回的数据
        const musicList = res.data.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          duration: item.duration,
          category: 'square', // 默认分类
          rhythm: 'fast4', // 默认节奏
          url: item.url,
          isPlaying: false,
          isCollected: false
        }));

        this.setData({
          musicList: musicList,
          originalMusicList: musicList // 保存原始音乐列表
        });
        
        wx.hideLoading();
      },
      fail: err => {
        console.error('获取音乐列表失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '加载音乐列表失败',
          icon: 'none'
        });
        
        // 使用备用数据
        const backupMusicList = [
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
          musicList: backupMusicList,
          originalMusicList: backupMusicList // 保存原始音乐列表
        });
      }
    });
  },

  // 搜索输入事件
  onSearchInput: function(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    
    // 实时搜索
    if (keyword.trim()) {
      // 从原始音乐列表中过滤
      const filteredList = this.data.originalMusicList.filter(item => 
        item.title.includes(keyword) || item.artist.includes(keyword)
      );
      this.setData({
        musicList: filteredList
      });
    } else {
      // 搜索关键词为空，显示全部音乐
      this.setData({
        musicList: this.data.originalMusicList
      });
    }
  },

  // 搜索确认事件
  onSearchConfirm: function() {
    // 搜索确认事件，与输入事件逻辑相同
    const keyword = this.data.searchKeyword;
    if (keyword.trim()) {
      // 从原始音乐列表中过滤
      const filteredList = this.data.originalMusicList.filter(item => 
        item.title.includes(keyword) || item.artist.includes(keyword)
      );
      this.setData({
        musicList: filteredList
      });
    } else {
      // 搜索关键词为空，显示全部音乐
      this.setData({
        musicList: this.data.originalMusicList
      });
    }
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


})