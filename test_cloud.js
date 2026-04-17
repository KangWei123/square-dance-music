// 测试云开发功能
wx.cloud.init({
  env: 'cloud1-9gon47lr177773ed',
  traceUser: true
});

// 测试获取临时链接
function testGetTempFileURL() {
  wx.cloud.getTempFileURL({
    fileList: ['cloud://cloud1-9gon47lr177773ed.636c-cloud1-9gon47lr177773ed-1422719685/music/小苹果.mp3'],
    success: res => {
      console.log('获取临时链接成功:', res);
      if (res.fileList[0].tempFileURL) {
        console.log('临时链接:', res.fileList[0].tempFileURL);
      } else {
        console.error('tempFileURL为空');
      }
    },
    fail: err => {
      console.error('获取临时链接失败:', err);
    }
  });
}

// 测试云开发环境
function testCloudEnv() {
  wx.cloud.callFunction({
    name: 'echo',
    data: {
      message: 'Hello Cloud'
    },
    success: res => {
      console.log('云函数调用成功:', res);
    },
    fail: err => {
      console.error('云函数调用失败:', err);
    }
  });
}

// 执行测试
testGetTempFileURL();
testCloudEnv();
