title: node.js学习笔记(二)——node.js回调函数与事件
date: 2015-12-02 10:17:50
tags: node.js学习笔记
---
### 一、回调函数
#### 1.异步读取文件
```javascript
var fs = require('fs');
fs.readFile('file.txt','utf-8',function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});
console.log('end');
```
运行结果：
```
"end"
"fileContent"
```

#### 2.同步式读取文件
```javascript
var fs = require('fs');
var data = fs.readFileSync('file.txt','utf-8');
console.log(data);
console.log('end');
```
运行结果:
```
"fileContent"
"end"
```
#### 3.分析
异步调用时所做的工作只是将异步式I/O请求发送给了操作系统，然后立即返回并执行后面的语句，执行完以后进入事件循环监听事件，当fs接收到I/O请求完成的事件时，事件循环会主动调用回调函数完成后续工作。
同步则是阻塞等待完成后，继续执行。

### 事件
#### 1.普通事件的使用
```javascript
//声明事件对象
var EventEmitter = require('events').EventEmitter;
var event1 = new EventEmitter();
//注册事件
event1.on('cky_event',function(){
    console.log('这是一个自定义事件');
});
//触发事件
setTimeout(function(){
    event1.emit('cky_event');
}, 1000);
```
执行结果：
```
//1s后
"这是一个自定义事件"
```

#### 2. node.js的事件循环机制
1. Node.js在什么时候进入事件循环呢？
答案是Node.js程序是由事件循环开始，一直在寻找有没有新的没有处理的事件，然后一次去执行处理，直到事件循环结束，所有的逻辑都是事件的回调函数。

2. 如何使用自定义事件呢？
事件的回调函数在执行过程中，可能会发出IO请求或直接发射(emit)事件，执行完成后再返回这个事件的循环。