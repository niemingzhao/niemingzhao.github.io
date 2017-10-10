---
uuid: 2691a4f0-2a79-11ea-8486-776fa8141052
title: 电视直播
date: 2019-01-01 08:00:00
comments: false
---

<link rel="stylesheet" href="//cdn.bootcdn.net/ajax/libs/video.js/7.6.0/video-js.min.css"><select id="selector" style="display:block;margin:10px auto"></select><video id="player" class="video-js vjs-big-play-centered vjs-16-9" autoplay controls preload="auto" data-setup="{}"><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="//videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video><script src="//cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js"></script><script src="//cdn.bootcdn.net/ajax/libs/video.js/7.6.0/video.min.js"></script><script src="//cdn.bootcdn.net/ajax/libs/videojs-flash/2.2.0/videojs-flash.min.js"></script><script>var sources=[{name:"全国风景总览",src:"//gcalic.v.myalicdn.com/gc/wgw05_1/index.m3u8?contentid=2820180516001",type:"application/x-mpegURL"}];$(function(){for(var o=videojs("player"),e=sources||[],n="<option>请选择电视频道</option>",c=0;c<e.length;c++)n+='<option value="'+c+'">'+e[c].name+"</option>";$("#selector").append(n).change(function(){o.src(e[+$("#selector").val()])})})</script>
