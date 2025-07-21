---
uuid: b709d090-2a77-11ea-a744-1f4d64ae768d
title: Git常用命令小记
date: 2016-10-05 00:22:00
author: 聂明照
categories:
- 技术
tags:
- Git
toc: true
---

Git的使用确实要比SVN复杂，下面记录了一下Git的常用命令，以备以后查用。

<!-- more -->

## 排除监视文件

* 在代码库根目录添加一个`.gitignore`文件，在文件中写上文件名（含路径）或路径名即可

## 新建

* 新建一个代码库

```
$ git init <repo>
```

* 克隆一个项目

```
$ git clone [url]
```

## 配置

* 显示当前配置

```
$ git config --list
```

* 编辑配置文件

```
$ git config -e <--global>
```

* 设置用户信息

```
$ git config <--global> user.name "[name]"
$ git config <--global> user.email "[email]"
```

## 添加/删除

* 添加指定文件到暂存区

```
$ git add [file]
```

* 添加指定目录到暂存区，包含子目录

```
$ git add [dir]
```

* 添加当前目录的所有文件到暂存区

```
$ git add .
```

> 未完待续...
