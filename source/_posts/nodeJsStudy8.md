title: node.js学习笔记(八)——HTTP客户端
date: 2016-01-06 10:19:50
tags: node.js学习笔记
---
### 一、http模块提供了两个函数http.request和http.get。
功能是作为客户端向HTTP服务器发起请求。
#### 1. http.request(options,callback)
http.request发起HTTP请求，接受两个参数，option是一个类似关联数组的对象，表示请求的参数，callback是请求的回调函数，option常用的参数如下：

|参数 |含义|
|------|-----|
|host |请求网站的域名或IP地址|
|port |请求网站的端口，默认是80|
|method |请求方法，比如GET、POST|
|path|请求的相对于根的路径，默认是"/"。QueryString应该包含在其中，例如/search?query=cky|
|header |一个关联数组对象，为请求头的内容|
callback传递一个参数，为http.ClientResponse的实例。
http.request返回一个http.ClientRequest的实例。

例：
```javascript
//clientRequest.js
var http = require('http');
var querystring = require('querystring');
//启动服务
http.createServer(function(req,res){
	console.log('请求到了，解析参数');
	var post = '';
	req.on('data',function(chunk){
		post+=chunk;
	});
	req.on('end',function(){
		post = querystring.parse(post);
		//解析完成
		console.log("参数解析完成，返回给客户端name参数");
		res.end(post.address);
	});
}).listen(3000);

//客户端请求
var contents = querystring.stringify({//将JSON对象转换成JSON字符串
	name:'cky',
	age:21,
	address:'重庆'
});
var options = {
	host:'localhost',
	path:'/',
	port:3000,
	method:'POST',
	headers:{
		'Content-Type':'application/x-www-form-urlencoded',
		'Content-Length':contents.length
	}
}
//发送请求
var req = http.request(options,function(res){
	res.setEncoding('utf-8');
	res.on('data',function(data){
		console.log('后端返回数据');
		console.log(data);
	});
});
req.write(contents);
//必须调end()
req.end();
```
执行结果：
```javascript
请求到了，解析参数
参数解析完成，返回给客户端name参数
后端返回数据
cky
```
#### 2. http.get(options,callback)
 http模块还提供了一个更加简便的方法——http.get。它是http.request的简化版，唯一的区别在于http.get自动将请求方法设为GET请求，同时不需要手动调用req.end()；

 例：
 ```javascript
//clientGet.js
var http = require('http');
var url = require('url');
var util = require('util');
//启动服务
http.createServer(function(req,res){
	console.log('请求到了，解析参数');
	var params = url.parse(req.url,true);
	console.log('解析完成');
	console.log(util.inspect(params));
	console.log('向客户端返回');
	res.end(params.query.name);
}).listen(3000);

//客户端请求
http.get({
	'host':'localhost',
	path:'/user?name=cky&age=21',
	port:3000},function(res){
		res.setEncoding('utf-8');
		res.on('data',function(data){
			console.log('服务器端返回来的是：'+ data);
		});
	}
);

 ```
 执行结果：
 ```javascript
请求到了，解析参数
解析完成
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=cky&age=21
  query: { name: 'cky', age
  pathname: '/user',
  path: '/user?name=cky&age
  href: '/user?name=cky&age
向客户端返回
服务器端返回来的是：cky
 ```
 ### 二、http.ClientRequest
 该对象是由`http.request`或`http.get`返回产生的对象，表示一个已经产生而且正在进行的http请求，它提供了response事件，即`http.request`或`http.get`第二个参数指定的回调函数的绑定对象，__请求必须调用end方法结束请求__
 提供的函数：
 `request.abort()` 终止正在发送的请求
 `request.setTimeOut(time,[callback])`设置请求超时事件。
 更多请参考 ：[api文档](http://nodeapi.ucdok.com/#/api/http.html)

 ### 三、http.ClientResponse
`http.ClientResponse`是与`http.Response`相似，提供三个事件，data、end和close，分别在数据到达、传输结束、连接结束时触发。其中data事件传递一个参数chunk，表示接受到的数据。
 res的属性（表示请求的结果状态）：

||
|-|
|statusCode|http状态码|
|httpVersion|http协议版本|
|headers|HTTP请求头|
|trailers|HTTP请求尾|

res函数：
`response.setEncoding([encoding]):`设置默认的编码，当data事件被触发时，数据将以encoding编码，默认为null,以buffer形式储存。
`response.parse()`:暂停接收数据和发送事件，方便实现下载功能
`renspose.resume()`:以暂停状态恢复。