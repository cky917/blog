title: node.js学习笔记(四)——全局对象与全局变量
date: 2015-12-11 10:17:50
tags: node.js学习笔记
---
所有属性都可以在程序的任何地方访问，即全局变量。在javascript中，通常window是全局对象，而node.js的全局对象是global，所有全局变量都是global对象的属性，如：console、process等。
<!-- more -->
### 一、全局对象与全局变量
 global最根本的作用是作为全局变量的宿主。满足以下条件成为全局变量。
 1. 在最外层定义的变量
 2. 全局对象的属性
 3. 隐式定义的变量（未定义直接赋值的变量）
 node.js中不可能在最外层定义变量，因为所有的用户代码都是属于当前模块的，而模块本身不是最外层上下文。node.js中也不提倡自定义全局变量。

__Node提供以下几个全局对象，它们是所有模块都可以调用的__。
- global：表示Node所在的全局环境，类似于浏览器的window对象。需要注意的是，如果在浏览器中声明一个全局变量，实际上是声明了一个全局对象的属性，比如var x = 1等同于设置window.x = 1，但是Node不是这样，至少在模块中不是这样（REPL环境的行为与浏览器一致）。在模块文件中，声明var x = 1，该变量不是global对象的属性，global.x等于undefined。这是因为模块的全局变量都是该模块私有的，其他模块无法取到。

- process：该对象表示Node所处的当前进程，允许开发者与该进程互动。
- console：指向Node内置的console模块，提供命令行环境中的标准输入、标准输出功能。

__Node还提供一些全局函数__。

- setTimeout()：用于在指定毫秒之后，运行回调函数。实际的调用间隔，还取决于系统因素。间隔的毫秒数在1毫秒到2,147,483,647毫秒（约24.8天）之间。如果超过这个范围，会被自动改为1毫秒。该方法返回一个整数，代表这个新建定时器的编号。
- clearTimeout()：用于终止一个setTimeout方法新建的定时器。
- setInterval()：用于每隔一定毫秒调用回调函数。由于系统因素，可能无法保证每次调用之间正好间隔指定的毫秒数，但只会多于这个间隔，而不会少于它。指定的毫秒数必须是1到2,147,483,647（大约24.8天）之间的整数，如果超过这个范围，会被自动改为1毫秒。该方法返回一个整数，代表这个新建定时器的编号。
- clearInterval()：终止一个用setInterval方法新建的定时器。
- require()：用于加载模块。
- Buffer()：用于操作二进制数据。

__Node提供两个全局变量，都以两个下划线开头__。

_filename：指向当前运行的脚本文件名。
_dirname：指向当前运行的脚本所在的目录。
除此之外，还有一些对象实际上是模块内部的局部变量，指向的对象根据模块不同而不同，但是所有模块都适用，可以看作是伪全局变量，主要为module, module.exports, exports等。

### 二、 process
 它用于描述当前Node.js进程状态的对象。提供了一个与操作系统的简单接口，通常写本地命令行程序的时候，会用到它。
 例：
 ```javascript
//命令行输入 node argv.js 'cky' 1993
//argv.js
console.log(process.argv);
process.stdout.write('cky');
 ```
 运行结果：
 ```javascript
[ 'E:\\下载的东西\\node\\node.exe',
  'D:\\myStudy\\nodeJsStudy\\process\\argv.js',
  'cky',
  '1993' ]
cky
 ```
 1. process.argv是命令行参数数组，第一个输出是node程序所在位置，第二个输出是脚本文件所在位置，第三个输出开始是运行参数。
 2. process.stdout是标准输出流，通常我们使用的console.log()其底层是用process.stdout.write()实现的。
 3. process.stdin是标准的输入流，在初识时他是被暂停的。要想从标准输入流读取数据，必须恢复流，并手动编写流的事件的相应函数。
 ```javascript
 //恢复流
process.stdin.resume();
process.stdin.on('data',function(data){
    process.stdout.write('read form' +data.toString());
});
```
 执行结果：
![](http://i12.tietuku.com/1c4b90d94b2fb0e7.png)

 4. process.nextTick(callback)的功能是为事件循环设置一项任务。Node.js会在下次事件循环调用callback。
Node.js适合IO密集型的应用，而不是计算密集型的应用。process.nextTick()提供了一个这样的工具，可以把复杂的工作拆散，变为较小的事件。将一个回调函数放在下次事件循环的顶部。
 ```javascript
function compute(){
    console.log('I am a compute method');
}
function somethingComplited(args){
    console.log('I am somthingComplited method');
    console.log(args);
}
function doSomething(args,callback){
    somethingComplited(args);
    callback();
}
doSomething('12345',function onEnd(){
    compute();
});
 ```
 如果假设compute()和somethingComplited()是两个较为耗时的函数。以上的程序在调用doSomething时会先执行somethingComplited(args)后立即调用回调函数，在onEnd()中又会执行compute()，改写为：

 ```javascript
function doSomething(args,callback){
    somethingComplited(args);
    process.nextTick(callback);
}
 ```
 使用process.nextTick()后，改写后的程序会把上面耗时的操作拆分为两个事件，减少每个事件的执行事件，提高事件响应速度。
更多process API可参考 [参考链接1](http://www.css88.com/archives/4548)，[参考链接2](http://www.nodejs.net/a/20121231/083747.html)

### 三、console
用于提供控制台的标准输出，node.js沿用了这个标准，提供与习惯行为一致的console对象。
1. `console.log()` 向标准输出流打印字符并以换行符结束。
案例：
```javascript
console.log("hello");
console.log("hello%cky");
console.log("hello%cky","cky");
```
2. `console.error()`用法与标准console.log()相同，只是向标准错误流输出。
3. `console.trace()`向标准错误流输出当前的调用栈。