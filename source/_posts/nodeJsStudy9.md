title: node.js学习笔记(九)——Express框架入门介绍
date: 2016-01-06 21:56:50
tags: node.js学习笔记
---
### 一、为什么要用Express框架？
Node.js由于不需要另外的HTTP服务器，因此减少了一层抽象，给性能带来不少的提升，同时也因此提高了开发难度，实现一个POST数据的表单。例如：
```html
<form>
	<input type="text" name="title"/>
	<input type="submit"/>
</form>
```
PHP中获取POST请求参数可以直接用 `$_POST('title');`
JAVA语言也可以用`request.getParameter('title')`；
而Node中获取就比较麻烦了，前几篇文章的例子中可以看到。
node.js虽然提供了HTTP模块，却不是让你直接用这个模块进行web开发的。http模块仅仅是一个HTTP服务器内核的封装。
使用express实现上述案例：
```javascript
var express = require('express');
var app = express.createServer();
app.use(express.bodyParser());
app.all('/',function(req,res){
	res.send(req.body.title);
});
app.listen(3000);
```
### 二、Express框架
npm提供了大量的第三方模块，其中不乏许多Web框架，我们没有必要重复造轮子，因此我们选择Express作为开发框架。
其提供了更高层的接口外，还实现了许多功能，如：
路由控制、模板解析支持、动态视图、用户会话、CSRF保护、静态文件服务、错误控制器、访问日志、缓存、插件支持等。

### 三、安装Express
`npm install -g express`
安装完成之后使用`express -help` 检测是否安装成功
如果报错express不是一个命令， 则执行`npm install -g express-generator`即可
Express在初始化一个项目的时候需要指定模板引擎，模式支持jade和ejs，为了降低学习难度，建议使用ejs。

### 四、建立工程
express -e pcat
当前目录出现了子目录pcat并产生了一些文件：
![](http://i4.tietuku.com/724f4057ebf5adfc.png)
提示我们进入pcat目录执行npm install命令
无参数的npm install命令会检查当前目录下的package.json并自动安装所有指定的依赖。

### 五、启动服务器
window环境下：
执行`set DEBUG=pcat`
再执行`npm start`
访问localhost:3000即可访问。

更多介绍见[express官网](http://www.expressjs.com.cn/)