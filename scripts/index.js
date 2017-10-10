'use strict';

const fs = require('hexo-fs');

hexo.extend.generator.register('custom', function() {
  return ['custom.css', 'custom.js'].map(item => ({
    path: item,
    data: function() {
      return fs.existsSync(`source/${item}`) ? fs.createReadStream(`source/${item}`) : '';
    }
  }));
});

function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

function new_post(post) {
  let lines = post.content.split('\n');
  let index = lines.findIndex(item => item === 'uuid:');
  if (index > -1) {
    lines[index] += ' ' + uuid();
  } else {
    lines.splice(1, 0, 'uuid: ' + uuid());
  }
  post.content = lines.join('\n');
  if (post.path !== false) {
    fs.writeFile(post.path, post.content, () => {});
  }
}

function before_render(post) {
  if (post.layout == 'post' && !post.uuid) {
    let lines = post.raw.split('\n');
    let index = lines.findIndex(item => item === 'uuid:');
    post.uuid = uuid();
    if (index > -1) {
      lines[index] += ' ' + post.uuid;
    } else {
      lines.splice(1, 0, 'uuid: ' + post.uuid);
    }
    post.raw = lines.join('\n');
    fs.writeFile(post.full_source, post.raw, () => {});
  }
}

hexo.on('new', new_post);
hexo.extend.filter.register('before_post_render', before_render);
