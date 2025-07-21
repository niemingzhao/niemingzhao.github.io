---
uuid: b709f7a2-2a77-11ea-a744-1f4d64ae768d
title: 为本机Git配置SSH链接
date: 2017-01-07 20:24:00
author: 聂明照
categories:
- 技术
tags:
- Git
toc: true
---

访问代码仓库时，需要建立安全链接，对于Git，常用的安全链接协议有HTTPS和SSH两种。HTTPS使用更简单，只需在向仓库提交代码时提供一下用户名和密码即可。但是经常出现需要频繁提供用户名和密码的情况，这个不能忍。相比之下，SSH的方式虽然配置有点难，但一次配置，次次可用，是个更好的方式。

<!-- more -->

## 配置方式

### 配置Git账户信息

要使用Git建立远程链接，肯定要先配置本机的Git账户信息啦。
首先打开本机上的bash终端，下面的命令行都是在bash终端中执行的，使用windows系统的小伙伴们不要使用cmd，需要打开git-bash才行。

```
git config --global user.name "username"
git config --global user.email "email"
```

上面引号里就是你的远程代码仓库（如github）的账号信息了，username是用户名（昵称），email是注册邮箱。

### 检查本机是否存在SSH Key

检查一下本机是不是已经建立过SSH Key，如果有的话可以备份到其它地方保存，然后删除掉本机的SSH Key。

```
cd ~/.ssh
```

如果执行命令后，会进入文件夹，就说明已经建立过SSH Key，需要清空。

### 生成新的SSH Key

```
ssh-keygen -t rsa -C "email"
```

执行命令后，会问你一些问题，是否要建立密码一类的，不用管，一路回车略过就行。然后你会在你的本机用户主目录下看到一个`.ssh`的文件夹。里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。

### 为远程仓库配置SSH Key

进入你的远程仓库（如github）的设置（总账户的设置而不是单个代码库的设置），点开`SSH and GPG keys`，然后点击`New SSH key`，Title随便填，再打开`id_rsa.pub`文件，复制所有内容填到Key文本框内，点击`Add SSH key`保存即可。

### 测试SSH链接

```
ssh -T git@github.com
```

执行命令后，可能会问你是否继续链接，输入`yes`回车即可。如果看到`Hi`后面是你的用户名，就说明配置成功，以后就可以直接提交代码了。
