chrome.browserAction.onClicked.addListener(function (tab) {
  var fields = ['ak', 'sk', 'bucket', 'domain', 'region', 'prefix'];
  var isConfigured = true;
  for (var i = 0; i < fields.length; i++) {
    if (!localStorage.getItem(fields[i])) {
      isConfigured = false;
    }
  }
  if (!isConfigured) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon.png',
      title: '提示',
      message: '首次使用请填写七牛云配置文件',
      requireInteraction: true
    });
    chrome.tabs.create({
      url: 'options.html'
    });
    return;
  }

  var w = 500; // 窗口宽度
  var h = 500; // 窗口高度
  var l = Math.round((screen.width / 2) - (w / 2));
  var t = Math.round((screen.height / 2) - (h / 2));
  chrome.windows.create({
    type: 'popup',
    url: 'popup.html',
    width: w,
    height: h,
    left: l,
    top: t,
    focused: true
  });
});