---
uuid: adbe3357-8eff-f406-dfbf-265d2192bd22
title: Ubuntu Server Settings
date: 2019-01-01 08:00:00
author: 聂明照
categories:
  - 技术
tags:
  - Linux
toc: true
sticky: 100
thumbnail: //images.niemingzhao.top/image/2020/12/20/wu_1elfkitn8je787615os16tlu257.jpg
---

Here is the record of configuring the basic environment and using common commands of Ubuntu Linux Server according to my usage habits. It is written here for my reference at any time.

<!-- more -->

### Ⅰ. Initial Settings

#### 1. Change Source List (Optional)

```
lsb_release -a

sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo vi /etc/apt/sources.list

:%d

...(for 18.04)
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
...
...(for 16.04)
# deb cdrom:[Ubuntu 16.04 LTS _Xenial Xerus_ - Release amd64 (20160420.1)]/ xenial main restricted
deb-src http://archive.ubuntu.com/ubuntu xenial main restricted #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
deb http://mirrors.aliyun.com/ubuntu/ xenial multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse #Added by software-properties
deb http://archive.canonical.com/ubuntu xenial partner
deb-src http://archive.canonical.com/ubuntu xenial partner
deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial-security universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-security multiverse
...

:wq!

sudo apt-get update
```

#### 2. Update System

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo apt-get install -f
sudo apt-get autoremove
sudo apt-get autoclean
sudo apt-get clean
```

#### 3. Add New User

```
sudo adduser nie

sudo vi /etc/sudoers

...
# User privilege specification
...
nie     ALL=(ALL:ALL) ALL
...

:wq!

history -c && history -w
su nie
```

#### 4. Enable SSH Remote Login

```
sudo apt-get install openssh-client
sudo apt-get install openssh-server

sudo vi /etc/ssh/sshd_config

...
PermitRootLogin no
...

:wq!

sudo service ssh restart
```

#### 5. Install Basic Environment

```
sudo apt-get install git
sudo apt-get install wget
sudo apt-get install curl
sudo apt-get install openssl
sudo apt-get install libssl-dev
sudo apt-get install ca-certificates
sudo apt-get install build-essential

sudo apt-get install python
sudo apt-get install python-pip
sudo apt-get install python-dev
sudo apt-get install python3
sudo apt-get install python3-pip
sudo apt-get install python3-dev
sudo apt-get install python3-venv

mkdir ~/.pip
vi ~/.pip/pip.conf

...
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
...

:wq!

cd ~
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip setuptools
pip install wheel twine autopep8 pylint PyInstaller Sphinx PyQt5 numpy sympy scipy pandas matplotlib scikit-learn scikit-image requests beautifulsoup4 jupyter jupyter_contrib_nbextensions
jupyter contrib nbextension install --sys-prefix
mkdir ~/workspace
mkdir ~/workspace/notebook
jupyter notebook --generate-config
jupyter notebook password
vi ~/.jupyter/jupyter_notebook_config.py

...
c.NotebookApp.notebook_dir = u'/home/nie/workspace/notebook'
c.NotebookApp.allow_remote_access = True
c.NotebookApp.open_browser = False
c.NotebookApp.ip = '*'
c.NotebookApp.port = 8888
...

:wq!

sudo vi /lib/systemd/system/jupyter.service

...
[Unit]
Description=jupyter
After=network.target
[Service]
User=nie
Group=nie
Type=simple
PIDFile=/run/jupyter.pid
WorkingDirectory=/home/nie/workspace/notebook
EnvironmentFile=/home/nie/venv/bin/jupyter
ExecStart=/home/nie/venv/bin/jupyter notebook
Restart=always
RestartSec=30s
[Install]
WantedBy=multi-user.target
...

:wq!

sudo systemctl daemon-reload
sudo systemctl enable jupyter.service
sudo systemctl start jupyter.service
sudo systemctl status jupyter.service

deactivate

sudo apt-get install software-properties-common
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
sudo apt-get install oracle-java8-set-default
sudo vi /etc/environment

...
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
JRE_HOME="/usr/lib/jvm/java-8-oracle/jre"
...

:wq!

source /etc/environment
echo $JAVA_HOME

sudo apt-get install maven

sudo apt-get install nginx
ls /etc/nginx/sites-available
ls /etc/nginx/sites-enabled
sudo service nginx reload

sudo apt-get install tomcat8
sudo apt-get install tomcat8-admin tomcat8-docs tomcat8-examples tomcat8-user
ls /var/lib/tomcat8/webapps
sudo vi /etc/tomcat8/tomcat-users.xml

...
  <role rolename="manager-gui"/>
  <role rolename="admin-gui"/>
  <user username="nie" password="123456" roles="manager-gui,admin-gui"/>
</tomcat-users>
...

:wq!

sudo service tomcat8 restart

sudo apt-get install nodejs
sudo apt-get install nodejs-dev
sudo apt-get install npm
npm config set registry https://registry.npm.taobao.org
sudo npm install -g npm
sudo npm install -g n
sudo n lts
sudo npm cache clean --force

sudo apt-get install mariadb-server mariadb-client
sudo mysql -u root

use mysql;
update user set plugin='' where User='root';
flush privileges;
exit

sudo service mysql restart
sudo mysql_secure_installation
sudo mysql -u root -p

exit

sudo apt-get install mongodb
sudo service mongodb restart
mongo

exit

sudo apt-get install redis-server
sudo service redis-server restart
redis-cli

exit
```

#### 6. Safeguard System

```
sudo apt-get install rkhunter
sudo vi /etc/rkhunter.conf

...
UPDATE_MIRRORS=1
...
MIRRORS_MODE=0
...
WEB_CMD=""
...

:wq!

sudo rkhunter --update
sudo rkhunter --checkall

sudo apt-get install clamav
sudo apt-get install clamav-daemon
sudo clamscan -r ~/ --remove

sudo apt-get install denyhosts
sudo vi /etc/denyhosts.conf

...
PURGE_DENY = 1h
...

:wq!

sudo service denyhosts stop
sudo denyhosts --purge
sudo service denyhosts restart
sudo iptables --flush
```

#### 7. Cleanup System

```
sudo apt-get autoremove --purge
sudo apt-get autoclean
sudo apt-get clean
kill -9 $(ps -A -ostat,ppid | grep -e '[zZ]'| awk '{ print $2 }')
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
history -c && history -w
```

#### 8. Backup System

```
sudo su
cd /
tar -cvpzf backup.tar.gz --exclude=/backup.tar.gz --exclude=/proc --exclude=/sys --exclude=/mnt --exclude=/media --exclude=/run --exclude=/dev /

sudo su
cd /
tar -xvpzf backup.tar.gz -C / --numeric-owner
mkdir /proc /sys /mnt /media
reboot

(from Live CD)
sudo su
cd /
ls /media
rm -fr /media/whatever/*
tar -xvpzf /path/to/backup.tar.gz -C /media/whatever --numeric-owner
mkdir /media/whatever/proc /media/whatever/sys /media/whatever/mnt /media/whatever/media
for f in dev dev/pts proc ; do mount --bind /$f /media/whatever/$f ; done
chroot /media/whatever
dpkg-reconfigure grub-pc
reboot
```

### Ⅱ. Command Skills

#### 1. Software

```
apt-cache search package  # 查找软件库中的包
apt-cache show package  # 显示包信息
apt-cache depends package  # 查询包依赖哪些包
apt-cache rdepends package  # 查询包被哪些包依赖
sudo apt-get update  # 更新包列表
sudo apt-get upgrade  # 升级所有包
sudo apt-get dist-upgrade  # 升级所有包，更新依赖关系
sudo apt-get install -f  # 修复所有包依赖关系
sudo apt-get install package  # 安装包
sudo apt-get install package --reinstall  # 重新安装包
sudo apt-get remove package  # 卸载包
sudo apt-get purge package  # 卸载包，删除配置文件
sudo apt-get autoremove  # 卸载孤立包
sudo apt-get autoclean  # 清理旧版本包缓存
sudo apt-get clean  # 清理所有包缓存
sudo apt-get check  # 检查所有包依赖关系

dpkg -L package  # 查看包安装内容
dpkg -S filename  # 查找文件属于哪个包
dpkg -l  # 查看已安装包列表
dpkg -l | grep package  # 查看已安装相关包列表
```

#### 2. System

```
uname -a  # 查看内核
lsb_release -a  # 查看系统版本
lscpu  # 查看CPU信息
lsmod  # 查看内核模块信息
lspci  # 查看PCI设备
lsusb  # 查看USB设备
lsblk  # 查看块设备
sudo lshw  # 显示硬件信息
sudo dmidecode  # 显示硬件信息
cat /proc/cpuinfo  # 查看CPU信息
cat /proc/interrupts  # 查看中断信息
cat /proc/meminfo  # 查看内存使用信息
cat /proc/net/dev  # 查看网络统计信息
cat /proc/mounts  # 查看文件系统信息
cat /proc/swaps  # 查看swap使用信息
cat /proc/mdstat  # 查看软raid阵列信息
cat /proc/scsi/scsi  # 查看硬raid阵列信息
uptime  # 显示系统运行时间
date  # 显示系统日期
last  # 查看系统登录情况
lastlog  # 查看用户登录情况
ulimit -a  # 查看系统限制
ipcs -l  # 查看内核限制

blkid  # 查看硬盘分区ID
sudo fdisk -l  # 查看硬盘分区
sudo fdisk /dev/sda1  # 硬盘分区
sudo mkfs -t ext3 /dev/sda1  # 硬盘格式化，ext3分区
sudo mkfs -t vfat /dev/sda1  # 硬盘格式化，fat32分区
sudo mkfs -t ntfs /dev/sda1  # 硬盘格式化，ntfs分区
sudo mount -t ntfs -o nls=utf8,umask=0 /dev/sdb1 /mnt/c  # 只读挂载ntfs分区
sudo mount -t ntfs-3g -o locale=zh_CN.utf8,umask=0 /dev/sdb1 /mnt/c  # 可写挂载ntfs分区
sudo mount -t vfat -o iocharset=utf8,umask=0 /dev/sda1 /mnt/c  # 挂载fat32分区
sudo mount -t smbfs -o username=xxx,password=xxx,iocharset=utf8 //192.168.1.1/share /mnt/share  # 挂载网络共享文件
sudo mount -t iso9660 -o loop,utf8 xxx.iso /mnt/iso  # 挂载ISO文件
sudo umount /dev/sda1  # 卸载分区
df -h  # 查看硬盘剩余空间
sudo du -hs dirname  # 查看目录占用空间

free -h  # 查看内存使用情况
top  # 动态显示进程执行情况
ps -A  # 查看当前进程
ps -ef | grep srvname  # 查看进程执行情况
pstree  # 查看当前进程树
sudo kill PID  # 中止进程
sudo kill -9 PID  # 强制中止进程
sudo lsof -p PID  # 查看进程打开的文件
sudo lsof filename  # 查看打开文件的进程
sudo lsof -i :portname  # 查看使用端口的进程
nohup program &  # 后台运行程序

ifconfig  # 查看IP地址
ping IP  # 查看IP地址连接情况
host hostname  # 查看主机名称对应的IP地址
sudo route -n  # 查看路由信息
sudo netstat -atnp  # 查看网络连接状况
sudo dhclient  # 使用DHCP协定从服务器获取IP地址
sudo iptables -t nat -L  # 查看nat规则
sudo iptables -L -n  # 查看filter规则

service --status-all  # 查看全部服务状态
sudo service srvname start  # 启动服务
sudo service srvname stop  # 停止服务
sudo service srvname restart  # 重启服务
sudo service srvname status  # 查看服务状态

sudo adduser username  # 增加用户，创建用户目录
sudo useradd username  # 增加用户
sudo deluser username  # 删除用户，删除用户目录
sudo userdel username  # 删除用户
sudo addgroup groupname  # 增加用户组
sudo groupadd groupname  # 增加用户组
sudo delgroup groupname  # 删除用户组
sudo groupdel groupname  # 删除用户组
sudo passwd username  # 修改用户密码
sudo chfn username  # 修改用户资料
sudo gpasswd –a username groupname  # 添加用户至用户组
sudo gpasswd –d username groupname  # 从用户组删除用户
sudo usermod -L username  # 锁定用户
sudo usermod -U username  # 解锁用户
sudo groupmod -n groupname groupname  # 重命名用户组
groups username  # 查看用户所属的用户组
newgrp groupname  # 切换到用户组
su username  # 切换用户
sudo su  # 切换root用户
whoami  # 查看当前用户
who  # 查看当前用户登录信息

sudo shutdown -h now  # 关机
sudo halt  # 关机
sudo shutdown -r now  # 重启
sudo reboot  # 重启
```

#### 3. File

```
touch filename  # 创建空文件
cat filename  # 一屏查看文件
more filename  # 分页查看文件
less filename  # 可控分页查看文件
cat -n filename  # 带行号查看文件
grep string filename  # 根据字符串匹配来查看文件
grep -l -r string dirname  # 显示内容包含字符串的文件名
grep -L -r string dirname  # 显示内容不包含字符串的文件名
find dirname -name filename  # 查找文件
head -n 2 filename  # 显示文件开始两行的内容
tail -n 2 filename  # 显示文件末尾两行的内容

pwd  # 查看当前目录
cd dirname  # 切换目录，~为home，/为root，.为current，..为parent，-为previous
ls dirname  # 查看目录内容
ls -a dirname  # 查看目录内容，包含隐藏文件
ls -l dirname  # 详细查看目录内容
mkdir -pv dirname  # 递归创建目录
rm -fr dirname  # 递归删除文件/目录
mv srcname distname  # 移动文件/目录，可用来重命名
cp srcname distname  # 复制文件
cp -r srcname distname  # 复制目录
file filename  # 查看文件类型
stat filename  # 查看文件时间
diff filename filename  # 对比文件差异
ln -s srcname distname  # 建立软连接

tar -zcvf xxx.tar.gz dirname  # 压缩目录为xxx.tar.gz
tar -xf xxx.tar.gz -C dirname  # 解压缩xxx.tar.gz到目录

sudo chown username:groupname filename  # 改变文件/目录的所属用户和组
sudo chown -R username:groupname dirname  # 改变目录及其内容的所属用户和组
sudo chmod u+rwx filename  # 修改文件/目录权限，用户添加读写运行权限
sudo chmod g+r filename  # 修改文件/目录权限，组成员添加读权限
sudo chmod o+r filename  # 修改文件/目录权限，其他用户添加读权限
sudo chmod a+w filename  # 修改文件/目录权限，所有用户添加写权限
sudo chmod 777 filename  # 修改文件/目录权限，所有用户添加读写运行权限
sudo chmod go-rwx filename  # 修改文件/目录权限，删除组成员与其他用户对目录的读写执行权限
```
