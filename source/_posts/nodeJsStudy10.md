title: node.js学习笔记(十)——工程的结构
date: 2016-01-06 23:16:50
tags: node.js学习笔记
---
### 一、app.js工程的入口
分析app.js代码：
<!-- more -->
```javascript
//引用模块
//我们导入了express模块，前面我们通过npm install依赖上了，在这里就可以通过require直接获取
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('myapp:server');
var http = require('http');
//routes是一个文件夹形式的本地模块，即/routes/index.
var routes = require('./routes/index');
var users = require('./routes/users');
//实例化express对象
var app = express();
//配置app的参数和启用中间件 见注1 注2
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
//错误处理中间件
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//开发模式下
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//创建http服务
var server = http.createServer(app);
//Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}
//Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
//Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;

```

注1. app.set是一个Express()的参数设置工具，接受一个键(key)和一个值(value)，可以用的参数如下：

|参数|用途|
|--|--|
|basepath|基础机制，通常用于res.redirect()跳转|
|port|指定的端口|
|view|视图文件目录，存放模板文件|
|view engine|视图模块引擎（如ejs jade）|
|view options|全局视图参数对象|
|view cache|启用视图缓存|
|case sensitive routes|路径区分大小写|
|strict routing|严格路径，启用后不会忽略路径末尾的"/"|
|jsonp callback|开启透明的jsonp支持|
更多请见[api文档](http://www.expressjs.com.cn/4x/api.html#app.set)

注2. 老版本Express依赖于connect，connect更加短小精悍，是一个偏向基础设施的框架，提供了大量的中间件，可以通过app.use()启用。
从 4.x 版本开始，, Express 已经不再依赖 Connect 了。除了 express.static, Express 以前内置的中间件现在已经全部单独作为模块安装使用了。请参考 [中间件列表](https://github.com/senchalabs/connect#middleware)。
[中间件](http://www.expressjs.com.cn/guide/using-middleware.html)：一系列的组件连接到一起，然后让http的请求一次流过这些组件。这些被connect串联起来的组件被称为中间件。

### 二、routes/index.js
routes/index.js是路由文件,相当于控制器，用于组织展示的内容。
app.js中通过`app.use('/',routes)`将'/'路径映射到routes/index.js函数下，交由其处理。
```javascript
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cky1' });
});

module.exports = router;
```	

### 三、index.ejs模板文件
它的基础是HTML语言，其中包含了`<%=title%>，功能是显示引用的变量，即通过render传过来的第二个参数的属性。