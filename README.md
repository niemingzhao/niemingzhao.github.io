# hexo-theme-default

An elegant Material Design theme for [Hexo](https://hexo.io/), based on [MDUI](https://www.mdui.org/).

## Installation

### Install

``` bash
$ git clone -b theme https://github.com/niemingzhao/niemingzhao.github.io.git themes/default
```

Make a copy of `_config.template.yml` under the same folder and rename the copied file to `_config.yml` (called `theme configuration file`). **This is the necessary step.**

### Enable

Modify `theme` item in `_config.yml` in the site root directory (called `site configuration file`) to `default`.

### Update

``` bash
cd themes/default
git pull
```

## Configuration

### _config.yml

``` yml
theme_color:
  primary: indigo
  accent: pink

notice:

favicon: /images/favicon.png
banner: /images/banner.png
avatar: /images/avatar.png
rss: /atom.xml

email:
sns:
  twitter:
  facebook:
  google_plus:
  weibo:
  instagram:
  tumblr:
  github:
  linkedin:
  zhihu:
  douban:
  qq:
  wechat:

open_graph:
  twitter:
  google_plus:
  fb_admins:
  fb_app_id:
site_verification:
  google:
  baidu:
analytics:
  google_site_id:
  baidu_site_id:
  cnzz_site_id:

pages:
- name: 时间轴
  link: /timeline
- name: 标签云
  link: /tagcloud
- name: 相册
  link: /gallery
links:

since:
footer_text:
license:

gallery:
  fancybox_css: //cdn.bootcdn.net/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css
  fancybox_js: //cdn.bootcdn.net/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
  jquery_js: //cdn.bootcdn.net/ajax/libs/jquery/3.3.1/jquery.min.js
  lazyload_js: //cdn.bootcdn.net/ajax/libs/jquery_lazyload/1.9.7/jquery.lazyload.min.js
busuanzi:
  site: false
  page: false
  busuanzi_js: //busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js
qrcode:
  caption: 发送到手机
  use: online
donate:
search:
  placeholder: 请输入关键字
  path: /search.xml
  use: online
comment:
  use: false
  disqus_shortname:
  gitalk_client_id:
  gitalk_client_secret:
  gitalk_repo:
  gitalk_owner:
  gitalk_sid_type:
  livere_data_uid:
  valine_leancloud_app_id:
  valine_leancloud_app_key:
  valine_placeholder:
  valine_page_size:
  valine_avatar:
  valine_lang:
  valine_guest_info:
  valine_notify:
  valine_verify:
  valine_sid_type:
  changyan_app_id:
  changyan_app_key:
  changyan_sid_type:
```

- **theme_color** - Theme color. Please refer to [颜色与主题](https://www.mdui.org/docs/color).
- **notice** - Notice or announcement. Support `<a>` tag.
- **favicon** - Favicon path.
- **banner** - Sidebar bg image path.
- **avatar** - Avatar image path.
- **rss** - RSS link. `hexo-generator-feed` plugin is needed.
- **email** - Email address.
- **sns** - SNS links.
- **open_graph** - OpenGraph settings.
- **site_verification** - Site verification KEYs.
- **analytics** - Site analytics IDs.
- **pages** - Custom page links. Set with `name` and `link`.
- **links** - Friendship links. Set with `name` and `link`.
- **since** - Start year, use a 4-digit number.
- **footer_text** - Additional text in footer, such as the record information. Support `<a>` tag.
- **license** - License description of the article. Support `<a>` tag.
- **gallery** - CDN links of `fancybox` plugin used on Gallery page.
- **busuanzi** - Use `busuanzi` plugin to count website visits.
- **qrcode** - Qrcode for articles. if use `plugin`, `hexo-helper-qrcode` plugin is needed.
- **donate** - Use your payment qrcode or link to receive donations. Set with `name` and `link`.
- **search** - Search settings. if use `plugin`, `hexo-generator-search` plugin is needed and `path` should be set correctly.
- **comment** - Comment plugin settings. Set `use` with the plugin name such as `disqus`.

### Front-matter

``` yml
thumbnail: /xxx.jpg  # Custom page header image.
author: xxx  # Author.
categories:  # Categories.
- xxx
tags:  # Tags.
- xxx
qrcode: false  # Disable article qrcode.
share_menu: false  # Disable article share menu.
license: xxx  # License description of the article.
donate: false  # Disable article donate link.
toc: true  # Enable article toc.
comments: true  # Enable article comment.

timeline: true  # Turn the current page into a timeline page.
tagcloud: true  # Turn the current page into a tagcloud page.
photos:  # Turn the current page into a gallery page.
- xxx
layout: custom  # Make the page available for custom styles.
```

### Other

> `Dark Mode`: Long press the page header to toggle dark mode.

> `Sticky Post`: Use with the plugin [`hexo-generator-topindex`](https://github.com/amlove2/hexo-generator-topindex) or update the official plugin [`hexo-generator-index`](https://github.com/hexojs/hexo-generator-index) to version 2.0.0, posts can be pinned to the top of index page.

> `Fancybox`: Set the `fancybox` class on the `<img>` tag in the post to enable the picture to popup, and the `center-block` class to center the picture.

**Recommended**: This theme works better with the parser [`hexo-renderer-markdown`](https://github.com/niemingzhao/hexo-renderer-markdown).
