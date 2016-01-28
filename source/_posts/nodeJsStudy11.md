title: node.js学习笔记(十一)——路由控制
date: 2016-01-07 14:08:50
tags: node.js学习笔记
---
### 一、工作原理
当访问http://localhost:3000， 浏览器会向服务器发送请求，包括请求的方法、路径、HTTP协议版本和请求头信息。app会解析请求的路径，调用相应的逻辑，route/index.js中有 `router.get('/',function(){})`通过`res.render('index',{title:"cky"})`调用视图模板index，传递title变量，最终生成HTML页面，返回给浏览器。
浏览器收到内容后，通过分析需要获取/stylesheet/style.css，因此会再次向服务器发起请求，app.js并没有一个路由指派到/stylesheets/style.css，但app通过`app.use(express.static(__dirname+'/public'))`配置了静态文件服务器，因此会定向到app.js所在目录下的/public/stylesheets/style.css拿取这个文件。

这是一个典型的MVC架构，浏览器发送请求，由路由控制接收，根据不同的路径定向到不同的服务器，控制器处理用户具体的请求，可能会访问数据库中的对象，即模型部分，生成视图的HTML，最后再由控制器返回给浏览器，完成一次请求。

### 二、创建路由规则
当我们在浏览器访问http://localhost:3000/cky 的时候，服务器响应头返回404 NOT FOUND的错误，这是因为/cky是一个不存在的路由规则，而且它也不是一个public目录下的文件，所以响应404。
假设我们创建一个/cky的路由规则
```javascript
router.get('/cky', function(req, res, next) {
  res.send("cky route");
});

```
即可访问。
服务器开始监听之前，设置好了所有的路由规则，当请求到来时直接分配到相应的函数，app.get是路由规则创建函数。

### 三、路径匹配
上面讲到了为固定的路径设置路由规则，Express还提供了更高级的路径匹配模式。
1.
```javascript
router.get('/user/:username',function(req,res){
    res.send('user:' +req.params.username);
});
```
访问结果：
![](http://i4.tietuku.com/52a6b8b573c8450b.jpg)
路径规则/user/username会自动编译成正则表达式，类似于\/user\/([^\/]+)\/?这样的形式，路径参数可以在相应函数中通过req.params的属性访问。

2. 路径规则同样支持javascript正则表达式，例如`router.get(\/user\/([^\/]+)\/?,callback)`这样的好处在于可以定义更加复杂的路径规则，不同之处是配置的参数是匿名的，因此需要通过req.params[0]这样的形式访问。

### 四、REST风格的路由规则
Express支持REST风格的请求方式，REST意思是表征状态转移，它是一种基于HTTP协议的网络应用的接口风格，充分利用HTTP的方法实现了统一风格的接口服务，HTTP协议定义了以下8个标准方法：

|请求方法|用途|
|---|---|
|GET|请求获取的资源 获取|
|POST|向指定资源提交数据 新增|
|DELETE|请求服务器删除指定资源 删除|
|PUT|请求服务器存储一个资源 更新|
|HEAD|请求指定资源的响应头|
|TRACE|回显服务器数到的请求，主要用户测试或诊断|
|CONNECT|HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。|
|OPTIONS|返回服务器支持HTTP请求方法|

Express对每种HTTP请求方法都设计了不同的路由绑定函数 
- GET : app.get(path,callback);
- POST: app.post(path,callback);
- PUT : app.put(path,callback);
- DELETE: app.delete(path,callback);
...
...
所有方法 app.all(path,callback);
app.all函数，它支持把所有的请求方法绑定到同一个相应函数，是一个非常灵活的函数。

### 五、控制权转移
Express支持同一路径绑定多个响应函数
```javascript
app.all('test/:user',function(req,res,next){
    res.send("all method is call");
    next();
});

app.get('/test/:user',function(req,res){
    res.send("user: " + req.params.user); 
});
```
但是我们访问都只会返回一次。
Express提供了路由控制权转移的方法，即next()函数，通过调用则将控制权交给后面的规则