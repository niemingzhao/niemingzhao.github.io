$(function () {
  var fields = ['ak', 'sk', 'bucket', 'domain', 'region', 'prefix'];
  for (var i = 0; i < fields.length; i++) {
    var ls = localStorage.getItem(fields[i]);
    document.querySelector('#' + fields[i]).value = ls ? ls : '';
  }

  document.querySelector('#save').addEventListener('click', function (e) {
    for (var i = 0; i < fields.length; i++) {
      var val = document.querySelector('#' + fields[i]).value.trim();
      if (!val) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: '提示',
          message: '为了图床的正常使用，请不要留空',
          requireInteraction: true
        });
        return;
      }
      localStorage.setItem(fields[i], val);
    }

    document.querySelector('#save').innerText = '保存成功';
    setTimeout(function () {
      chrome.tabs.query({
        currentWindow: true,
        active: true
      }, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
      });
    }, 500);
  });
});