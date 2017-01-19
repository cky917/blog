title: 使用pm2+github将node项目一键部署到远程服务器
tags:
- node.js学习笔记 
- web前端知识
---
每次在本地跑Node项目自娱自乐总不是很爽，一直想把自己的node项目部署到服务器上。但是我对于后端和运维知识我还是处于小白阶段，今天研究了一下午，总算是成功把自己的node项目搞了上去，又学到了新姿势。本文将介绍怎么从零开始，获得服务器，并将node项目通过github+pm2部署到远程服务器。
<!-- more -->

### 获得服务器
(已有服务器的可以跳过此步骤)。
我是用的腾讯的云服务器，因为腾讯云还是比较良心，云服务器开放了免费体验功能（不知道之后会不会关闭），很适合我们这种新手先试用再购买。通过这个【[链接](https://www.qcloud.com/act/try?t=cvm)】申请了免费试用。申请成功后，就会收到该改主机的信息。我选择的1核CPU、1GB内存,系统为CentOS 7.2 64位。

#### 登录云服务器
在本机终端输入以下命令即可连接上云服务器，然后需要输入给你的初始密码。
`ssh root@服务器公网ip`

#### 安装相关文件
更新yum（云服务器自带的包管理工具）：
```
yum update -y
```

更新完毕后，安装Node.js：
```
yum install nodejs -y
```

安装Npm：
```
yum install npm -y
```

安装pm2：
```
npm install pm2 -g
```
分别执行`node -v`、`npm -v`、`pm2 -v`查看是否安装成功，如果没有安装成功，前面加上`sudo`命令重试
#### 服务器端创建新用户（可选）

为服务器安全起见，创建用户(用户名：yourName)：
```
useradd yourName
```

设置密码：
```
passwd yourName
```

添加sudo权限：
```
usermod -aG wheel yourName
```

#### 服务器端关闭root用户的ssh访问(可选)：
为服务器安全起见，关闭root账户的远程访问。
打开配置文件：
```
vi /etc/ssh/sshd_config
```
按下`i`,切换vi为输入状态
找到如下设置，删除前面的`#`，并修改yes为no：
```
PermitRootLogin no
```
按下`esc`，切换vi为命令状态，然后输入`:wq`回车保存退出
保存文件后，重启sshd服务：
```
service sshd restart
```
退出root账户，并使用新创建用户访问。
```
ssh yourName@服务器公网ip
```

### 环境说明
本文的操作环境是
本地：Mac OSX  
远端服务器：腾讯云ECS（1核CPU、1GB内存），IP：119.29.101.229，系统为CentOS 7.2 64位
采用的技术：Node.js + Express.js
Github：账户名：cky917
以下命令全部带入我的账号，__自己使用时记得替换为自己的账号__。
本文对于Git基本操作和node也不做详细讲解。

### 本地创建node项目
具体如何创建，本文不详细讨论。假设已经建立好一个名为pm2Demo的项目。

### github建立链接
登录云服务器，安装git，生成ssh-key。然后将云服务器的ssh-key加到自己的github中。
在本地执行同样的操作。

进入本地项目目录./pm2Demo，将本地项目与github远程仓库建立连接。
```
git remote add origin https://github.com/cky917/pm2Demo.git
git push -u origin master
```
### pm2部署
pm2的介绍可以看看这篇[文章](https://segmentfault.com/a/1190000002539204)
详细的部署步骤也可以看[官方配置文档](http://pm2.keymetrics.io/docs/usage/deployment/#considerations)

本地安装pm2之后执行
```
pm2 ecosystem
```
会生成一个ecosystem.config.js(版本原因，也可能是ecosystem.json)文件，打开该文件进行配置。修改`script`配置为node项目启动文件。
```
apps : [
    //由于我们此次只有一个项目,我们只配置一个app
    {
      name      : "pm2Demo",
      script    : "./bin/www",
```
其余关于app部分的配置，可见[官方文档](http://pm2.keymetrics.io/docs/usage/application-declaration/);

再配置部署部分：
```
deploy : {
    production : {//生产环境部署配置
      user : "cky",//登录远程服务器的用户名
      host : "119.29.101.229",//远程服务器的IP或hostname，此处可以是数组同步部署多个服务器
      ref  : "origin/master",//远端名称及分支名
      repo : "git@github.com:cky917/pm2Demo.git",//git仓库地址
      path : "/home/cky/www/production/pm2Demo",//远程服务器部署目录，需要填写user具备写入权限的目录
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.config.js --env production",//部署后需要执行的命令
      "env"  : {
        "NODE_ENV": "production"
      }
    },
    dev : {//开发环境部署配置
      user : "cky",
      host : "119.29.101.229",
      ref  : "origin/dev",
      repo : "git@github.com:cky917/pm2Demo.git",
      path : "/home/cky/www/dev/pm2Demo",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.config.js --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
```
上面的代码我们部署了2个环境，当然你得有对应的分支。
改好后，我们将ecosystem.config.js代码提交到远程github仓库去，
```
git add .
git commit -m "update ecosystem"
git push
```
在云服务器端执行以下命令，将`http://github.com`加入known_hosts：
```
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
```
因为pm2的部署是通过ssh进行的，因此需要开通本地到远程服务器的无密码登录，同样，在Mac下，通过ssh-keygen生成RSA公钥，并拷贝到远程服务器：
```
scp ~/.ssh/id_rsa.pub cky@119.29.101.229:/home/cky/.ssh/authorized_keys
```
在本地执行命令把文件目录初始化到服务器端：
```
pm2 deploy <configuration_file> <environment> setup
//比如：
pm2 deploy ecosystem.config.js production setup
```
如果没有问题，会输出
```
  ...
  ○ setup complete
--> Success
```
### 一键部署代码到服务器
在本地./pm2Demo项目下，输入以下命令部署代码到服务器
```
pm2 deploy ecosystem.config.js production
```
会看到输出以下信息，表示部署成功：
```
 Use `pm2 show <id|name>` to get more details about an app
  ○ hook test
  ○ successfully deployed origin/master
--> Success

```
现在，你的代码已经被部署，而且项目也启动了。
pm2部署命令列表如下：
```
pm2 deploy <configuration_file> <environment> <command>
  Commands:
    setup                run remote setup commands
    update               update deploy to the latest release
    revert [n]           revert to [n]th last deployment or 1
    curr[ent]            output current release commit
    prev[ious]           output previous release commit
    exec|run <cmd>       execute the given <cmd>
    list                 list previous deploy commits
    [ref]                deploy to [ref], the "ref" setting, or latest tag
```
在这里我发现了一个问题，就是如果我的分支代码更新了，我执行部署更新命令拉取的提交记录还是初始化时的提交记录，我必须删掉服务器上的文件夹，重新执行初始化和部署的操作，不知道是本来就这样还是哪里出了问题，暂时没找到原因- -。

部署成功后，在远程服务器端输入`netstat -antp`查看端口情况。可以看到3000端口已经可以访问。
输入http://119.29.101.229:3000/ 就能访问到项目了（我把我简陋的毕设项目搞了上去 - -,管理员账户root,密码123 有兴趣可以登录试一下）

### 设置开机自动启动
可以通过pm2 startup来实现开机自启动。细节可[参考](http://pm2.keymetrics.io/docs/usage/startup/)。大致流程如下

1. 通过`pm2 save`保存当前进程状态。
2. 通过`pm2 startup [platform]`生成开机自启动的命令。（记得查看控制台输出）
3. 将步骤2生成的命令，粘贴到控制台进行，搞定。

### nginx反向代理
通过nginx反向代理，可以让服务器上某端口，指向指定域名的80端口，这样访问时就不需要加端口号了。
详细见[官方文档](http://pm2.keymetrics.io/docs/tutorials/pm2-nginx-production-setup)
//研究中，待补充
