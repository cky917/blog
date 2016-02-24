title: 利用Fiddler进行前端调试
date: 2016-02-24 09:34:50
tags: web前端知识

---
最近刚get了一个很方便前端调试的新技能，特别在已上线网页上修复bug的时候调试很实用，比如我在本地改了一个test1.js文件想要测试效果，但是又不想很麻烦地推到测试环境，就可以用这个工具把线上的test1.js文件请求到自己的本地test1.js文件，这样你的代码可以直接进行调试了。

首先我们要用的工具是[Fiddler](http://www.telerik.com/fiddler)，这是一个强大的工具，在这里我就不详细介绍了，有兴趣的可以去了解一下[慕课网：Fiddler工具的使用](http://www.imooc.com/learn/37)。

我们直接进入正题：利用Fiddler进行前端调试。

打开软件，我们看到的是这样的界面：
![软件界面](http://i12.tietuku.com/0dae4e6342d76660.png)
左边那些就是你的网络请求列表，右边是一些工具面板。

我们以coolmogu.com为例，打开本网站，出现以下请求：
![](http://i12.tietuku.com/9d594da04d3c7f65.png)

假如我们要修改index.js，在本地我们有一个index.js，具体步骤如下图
![](http://i12.tietuku.com/c7a48b44debcaced.png)

这样再刷新页面，实际coolmogu.com以后请求的index.js就是请求的你本地的Index.js了。假如我index.js里加了一行`alert("cky")`, ![](http://i11.tietuku.com/535ba941a555232f.png) 看看效果：
![](http://i11.tietuku.com/f7a88298a20b38d6.png)

很简单吧，还可以用同样的方法进行css文件调试等~

![](http://i11.tietuku.com/075039e5a5add7b5.jpg)