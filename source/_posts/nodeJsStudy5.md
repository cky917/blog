title: node.js学习笔记(五)——常用工具util和事件EventEmitter
tags: node.js学习笔记
---
### 一、util全局变量
#### 1. `util.inherits(constructor,superConstructor)`
此方法是一个实现对象间原型继承的函数。javaScript通过原型赋值来实现继承。
<!-- more -->
例：
```javascript
//inherits.js
var util = require('util');
function Base(){
    this.name = 'base';
    this.base = 2012;
    this.sayHello = function(){
        console.log('hello ' + this.name + ' this year is ' + this.base);
    };
}
Base.prototype.showName = function(){
    console.log(this.name);
};
function Sub(){
    this.name = 'sub';
}
util.inherits(Sub, Base);
//原有输出
var objBase = new Base();
objBase.showName();
objBase.sayHello();

console.log(objBase);
//继承后的子类输出
var objSub = new Sub();
objSub.showName();
//objSub.sayHello(); 报错
console.log(objSub);
```
    执行结果：
    ```javascript
    base
    hello base this year is 2012
    Base { name: 'base', base: 2012, sayHello: [Function] }
    sub
    Sub { name: 'sub' }
    ```
注意：Sub 仅仅继承了Base 在原型中定义的函数，而构造函数内部创造的 base 属 性和 sayHello 函数都没有被 Sub 继承。
#### 2. `util.inspect(object,[showHidden],[depth],[colors])`
此方法是一个将任意对象转换 为字符串的方法，通常用于调试和错误输出。它至少接受一个参数 object，即要转换的对象。
showHidden 是一个可选参数，如果值为 true，将会输出更多隐藏信息。
depth 表示最大递归的层数，如果对象很复杂，你可以指定层数以控制输出信息的多 少。如果不指定depth，默认会递归2层，指定为 null 表示将不限递归层数完整遍历对象。 如果color 值为 true，输出格式将会以ANSI 颜色编码，通常用于在终端显示更漂亮 的效果。
特别要指出的是，util.inspect 并不会简单地直接把对象转换为字符串，即使该对 象定义了toString 方法也不会调用。

#### 3.`util.isArray(object)`
如果给定的参数 "object" 是一个数组返回true，否则返回false。
```javascript
var util = require('util');

util.isArray([])
  // true
util.isArray(new Array)
  // true
util.isArray({})
  // false
```
类似的还有`util.isRegExp(object)`、`util.isDate(object)`、`util.isError(object)`

更多api点击[参考链接](http://nodeapi.ucdok.com/#/api/util.html)

### 二、事件驱动
events是Node.js最重要的模板，原因是Node.js本身架构就是事件式的，而它提供了唯一的接口。events模块不仅用于用户代码与NOde.js下层事件循环的交互。还几乎被所有的模块依赖。
#### 1.事件发射器
events模块只提供了一个对象——events.EventEmitter。EventEmitter的核心就是事件发射与时间监听器功能的封装。EventEmitter的每个事件由一个事件或若干个参数组成，事件名是一个字符串，通常表达一定的语义，对于每个事件，EventEmitter支持若干个事件监听器。当事件发射时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。
例子：
```javascript
var events = require('events');
//实例化事件对象
var emitter = new events.EventEmitter();
//注册事件监听1
emitter.on('someEvent',function(arg1,arg2){
    console.log('Listener1',arg1,arg2);
});
//注册事件监听2
emitter.on('someEvent', function(arg1,arg2){
    console.log('Listener2',arg1,arg2);
});
//触发事件
emitter.emit('someEvent','cky',1991);
```
执行结果：
```javascript
Listener1 cky 1991
Listener2 cky 1991
```

更多请参考[api文档](http://nodeapi.ucdok.com/#/api/events.html)

#### 2.error事件
EventEmitter定义了一个特殊的事件error，它包含错误的定义，我们在遇到异常的时候通常会发射error事件，当error事件被发射时，EventEmitter规定如果没有相应的监听器，Node.js会把它当作异常，退出程序打印调用栈，我们一般要为发射error的事件对象设置监听器，避免遇到错误后整个程序崩溃。
#### 3.继承Event
大多数时候我们不会直接使用EventEmitter，而是在对象中继承它，包括fs，net，http在内的。只要是支持事件相应的核心模块都是EventEmiiter的子类。
为什么这样做呢？
1. 具有某个实体功能的对象实现事件的符合语义，事件的监听和发射应该是一个对象的方法。
2. javascript的对象机制是基于原型的，支持部分多重继承，继承EventEmitter不会打乱对象原有的继承关系。