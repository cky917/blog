title: node.js学习笔记(七)——HTTP服务器
tags: node.js学习笔记
---
node.js提供了http模块。其中封装了一个高效的HTTP服务器和一个简易的HTTP客户端。
http.server是一个基于事件的HTTP服务器。内部有C++实现。接口由javascript封装。
http.request则是一个HTTP客户端工具。用户向服务器发送请求。
<!-- more -->
### 一、HTTP服务器
http.Server实现的，它提供了一套封装级别很低的API，仅仅是流控制和简单的解析，所有的高层功能都要通过它的接口。
例：
```javascript
//引入模块
var http = require('http');
//创建服务
http.createServer(function(req,res){
    //响应头
    res.writeHead(200,{'Content-Type':'text/html'});
    //响应内容
    res.write("<h1>Node.wqewqewqjs</h1>");
    //结束响应
    res.end('<p>PCAT</p>');
//监听端口
}).listen('3000');
console.log('HTTP server is listening at port 3000');
```
执行后访问结果：
![](http://i4.tietuku.com/7ef205ca829b96f0.png)

代码分析：
http.creatServer()创建了一个http.Server的实例，将一个函数作为HTTP请求处理函数。这个函数接受两个参数，请求对象req和响应对象res。res显式地写入了响应代码200（表示请求成功），指定响应头，写入响应体，调用end结束并发送。该实例调用listen函数，启动服务器并监听3000端口。
#### 1.http.server事件
http.server是一个基于事件的HTTP服务器，所有请求都被封装成独立的事件，开发者只要对它的事件编写相应的函数即可实现HTTP服务器的所有功能，它继承于EventEmitter，提供了以下事件：
**request**：当客户端请求到来时，该事件被触发，提供两个参数req和res，分别是http.ServerRequest和http.ServerResponse的实例，表示请求和响应信息。
例：
在上面代码的`http.creatServer()`回调函数中，加入一句`console.log(req.url);`
当在浏览器中输入路径`http://localhost:3000/user?name=cky`时。
结果：
![](http://i4.tietuku.com/3316acda98d8a698.jpg)
**connection**：当TCP连接建立时，该事件被触发，提供了一个参数socket，为net.Socket的实例（底层协议对象）。
**close**：当服务器关闭时，该事件被触发。
最常用和关心的是：request事件，http提供了一个捷径：http.createServer()方法。不需要原生创建。
原生创建方法：
```javascript
var http = require('http');
var server = new http.Server();
server.on('request',function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write("<h1>Node.wqewqewqjs</h1>");
    res.end('<p>PCAT</p>');
});
server.listen('3000')
```
更多详细内容，见[api文档](http://nodeapi.ucdok.com/#/api/http.html);

#### 2.http.ServerRequest，请求的信息
此对象是后端开发者最关注的内容，它一般由http.Server的request事件发送，作为第一个参数传递，通常简写成request或req。HTTP请求分为两部分：请求头和请求体。请求内容短的直接在请求头解析完成后立即读取，而请求体可能相对较长，需要一定时间传输，因此提供了三个时间用于控制请求体传输。
- data:当请求体数据到来时，该事件被触发，该事件有一个参数chunk,表示接收到的数据。
- end：当请求体数据传输完成时，该事件被触发，伺候将不会再有数据到来，
- close: 用户当前请求结束时，该事件被触发，不同于end，如果用户强制终止了传输，也会触发close。

__ServerRequest的属性：__

| 属性       | 含义           |
| ---------|-------------| 
| complete  | 客户端请求是否已经发送完成 | 
| httpVersion | HTTP协议版本，通常是1.0或1.1 |
| method  | HTTP请求方法，如GET,POST |
| url | 原始的请求路径 | 
| headers | HTTP请求头 |
| trailers| HTTP请求尾（不常见） |
| connection | 当前HTTP连接套接字，为net.Socket的实例 | 
| socket | connection属性的别名 |
| client| client属性的别名 |

#### 3.获取GET请求内容
由于GET请求直接被嵌入在路径中，URL完成的请求路径，包括了？后面的部分，因此你可以手动解析。node.js的url模块中的parse函数也提供了这个功能。
例：
```javascript
//引入模块
var http = require('http');
var urls = require('url');
var util = require('util');
//创建服务
http.createServer(function(req,res){
    res.writeHead(2000,{'Content-Type':'text/plain'});
    //解析并打成字符串返回给客户端
    res.end(util.inspect(urls.parse(req.url,true)));
}).listen(3000);
```
执行结果：
![](http://i4.tietuku.com/6703100aee0d87f1.jpg)

#### 4.获取POST请求的内容
POST请求的内容全部都在请求体中，http.ServerRequest并没有一个属性内容为请求体，原因是等待请求体传输可能是一件耗时的工作。譬如上传文件。恶意的POST请求会大大消耗服务器的资源。所以Node.js是不会解析请求体，当你需要的时候，需要手动来做。
例：
```javascript
var http = require('http');
var querystring = require('querystring');
var util = require('util');
http.createServer(function(req,res){
    var post = '';
    //注册data事件监听函数，每当接收请求体的数据
    req.on('data',function(chunk){
        post+=chunk;
    });
    req.on('end',function(){
        //将字符串解析为一个JSON对象
        post = querystring.parse(post);
        //向前端返回
        res.end(util.inspect(post));
    });
}).listen(3000);
```

#### 5.http.serverResponse，返回给客户端的信息
决定了用户最终得到的结果，它是由http.Server的request事件发送的，作为第二个参数传递。一般为response或res。
主要的三个函数：
- response.writeHead(statusCode,[headers]);向请求的客户端发送响应头。
    - statusCode是HTTP状态码，如200位成功，404为未找到等。
    - headers是一个类似关联数组的对象，表示响应头的每个属性。
- response.write(data,[encoding])向请求客户端发送相应的内容，data是buffer或字符串，encoding为编码。
- response.end([data],[encoding])结束响应，告知用户所有发送已经完成，当所有要返回的内容发送完毕，该函数必须被调用一次，如果不调用，客户端永远处于等待状态。