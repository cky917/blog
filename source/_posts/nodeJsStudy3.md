title: node.js学习笔记(三)——模块与包
tags: node.js学习笔记
---
模块(Module)和包(package)是Node.js最重要的支柱。开发一个具有一定规模的程序不可能只用一个文件，通常需要把各个功能拆分、分装、然后组合起来。模块正是为了实现这种方式而诞生，而浏览器JavaScript中，脚本模块的拆分和组合通常使用HTML的script标签来实现，Node.js提供了require函数来调用其他模块，而且**模块都是基于文件**，机制非常简单，模块和包的区别是透明的，因此经常不做区分。
<!-- more  -->
### 一、模块
1. #### 什么是模块
模块和文件是一一对应的。一个Node.js文件就是一个模块，这个文件可能是JavaSript代码、JSON或者编译过的C/C++扩展。
`var http = require('http')`，其中的`http`是Node.js的一个核心模块，通过require函数获取这个模块，然后使用其中的对象。

2. #### 创建及加载模块
 (1). 创建模块
 Node.js提供了exports和require两个对象，其中exports是模块公开的接口，require用于从外部获取一个模块的接口，即获取模块的exports对象。
 ```javascript
 //module.js
var name;
exports.setName = function(theName){
    name = theName;
};
exports.sayHello = function(){
    console.log('hello '+ name);
};
 ```
 ```javascript
 //getModule.js
var myModule = require('./module');
myModule.setName('cky');
myModule.sayHello();
 ```
 执行getModule.js结果：
```javascript
"hello cky"
```
 (2). 单次加载
  ```javascript
 //getModule2.js
var myModule1 = require('./module');
myModule1.setName('cky1');
var myModule2 = require('./module');
myModule2.setName('cky2');
myModule1.sayHello();
```
 执行getModule2.js结果：
```javascript
"hello cky2"
```
  以上的例子类似创建对象，但是和创建对象有本质区别。因为**require不会重复加载模块**，也就是无论调用多少次require，所获取到的模块都是同一个(见第四点说到的require查找策略)。

 (3). 覆盖exports
 有时候我们只是想把一个对象封装到模块中，就可以这样：
 ```javascript
 //singleObject.js
function hello(){
    var name;
    this.setName = function(theName){
        name = theName;
    };
    this.sayHello = function(){
        console.log('hello' + name);
    };
}
module.exports = hello;
 ```
 ```javascript
 //getSingleObject.js
var hello = require('./singleObject');
var he1 = new hello();
he1.setName('cky1');
he1.sayHello();
var he2 = new hello();
he2.setName('cky2');
he2.sayHello();
 ```
 执行getSingleObject.js结果：
```javascript
"hello cky1"
"hello cky2"
```

3. #### 模块分类
 Node.js的模块分为两类，一类为原生（核心）模块，一类为文件模块。

 在文件模块中，又分为3类模块。这三类文件模块以后缀来区分，Node.js会根据后缀名来决定加载方法。

 - .js。通过fs模块同步读取js文件并编译执行。
 - .node。通过C/C++进行编写的Addon。通过dlopen方法进行加载。
 - .json。读取文件，调用JSON.parse解析加载。

 Node.提供了exports和require两个对象,其中exports是模块公开的接口,require用于从外部获取一个模块接口,即所获取模块的exports对象.

4. #### require查找策略
 __原生模块__在Node.js源代码编译的时候编译进了二进制执行文件，加载的速度最快。另一类__文件模块__是动态加载的，加载速度比原生模块慢。但是Node.js对原生模块和文件模块都进行了缓存，于是在第二次require时，是不会有重复开销的。尽管require方法极其简单，但是内部的加载却是十分复杂的，其加载优先级也各自不同。
 ![require查找策略](http://i12.tietuku.com/c914066941701bb7.jpg)

 require方法接受以下几种参数的传递：

 - http、fs、path等原生模块。
 - ./mod或../mod，相对路径的文件模块。
 - /pathtomodule/mod，绝对路径的文件模块。
 - mod，非原生模块的文件模块。

 当require一个文件模块时,从当前文件目录开始查找node_modules目录；然后依次进入父目录，查找父目录下的node_modules目录；依次迭代，直到根目录下的node_modules目录。

 简而言之，如果require绝对路径的文件，查找时不会去遍历每一个node_modules目录，其速度最快。其余流程如下：

 1. 从module path数组中取出第一个目录作为查找基准。
 2. 直接从目录中查找该文件，如果存在，则结束查找。如果不存在，则进行下一条查找。
尝试添加.js、.json、.node后缀后查找，如果存在文件，则结束查找。如果不存在，则进行下一条。
 3. 尝试将require的参数作为一个包来进行查找，读取目录下的package.json文件，取得main参数指定的文件。
 4. 尝试查找该文件，如果存在，则结束查找。如果不存在，则进行第3条查找。
 5. 如果继续失败，则取出module path数组中的下一个目录作为基准查找，循环第1至5个步骤。
 6. 如果继续失败，循环第1至6个步骤，直到module path中的最后一个值。
 7. 如果仍然失败，则抛出异常。

### 二、包
1. 包的概念
    包是在模块基础上更深一步的抽象，Node.js的包类似于C/C++的函数库或者java的类库，他将某个独立的功能封装起来，用于发布、更新、依赖管理的版本控制。开发了npm来解决了包的发布和获取需求。

这个待我之后补充。- -