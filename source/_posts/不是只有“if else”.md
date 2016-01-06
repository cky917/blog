title: 不是只有if和else
date: 2015-11-20 10:17:50
tags: Javascript学习笔记
---

在我们写javascript函数的时候，经常会使用到条件判断，使用得最多的就是if else进行判断了。使用得多了渐渐会特别依赖这个最简单的方法，而导致整个函数里好多if else,甚至嵌套很多层。仔细研究，我们会发现用一大段if else的逻辑，其实用其他方法，一句话就能够完全实现同样的功能。

#### 初级替代之一：三元表达式
    var max = a>b?a:b;

三元表达式的规则就是，当"?"前的表达式为true时，返回":"前的值，否则返回":"后的值。
所以上面那句表达式等价于
```javascript
if(a>b){
    max=a;
}else{
    max=b;
}
```
#### 初级替代之二：switch

switch作为条件判断的方法之二，很明显可以替代一些简单但是重复的if else。实例

```javascript
    if(str=="项链"){//用if else
        type="珠宝";
    }else if(str=="苹果"){
        type="水果";
    }else if(str=="仙人掌"){
        type="植物";
    }else{
        type="人类";
    }
```
```javascript
    switch(str){//switch
        case "项链": type="珠宝";
        break;
        case "苹果": type="水果";
        break;
        case "仙人掌": type="植物";
        break;
        default:
        type=="人类";
    }
```
但是看了上面的代码，肯定很多人会说，switch根本没有好到哪里去嘛，只是看上去稍微清晰了一点点。确实，所以我们有更简单的方法。

#### 高级替代：对象字面量；
    
    var typeMap = {"项链":"珠宝","苹果":"水果","仙人掌":"植物"};
    var type = typeMap[str];

上面两句话就完成了之前一大段的逻辑，不过还没有完全完成，因为有个默认值“人类”没有写进去。这个该怎么加进去呢？

#### 还有“&&”和“||”
    var typeMap = {"项链":"珠宝","苹果":"水果","仙人掌":"植物"};
    var type = typeMap[str]||"人类";

就这么两句话就完全实现了之前一大段逻辑判断的功能。不相信？可以试一试哦。
```javascript
    var type = typeMap["项链"]||"人类";
    console.log(type)// 珠宝

    var type2 = typeMap["不认识"]||"人类";
    console.log(type2)// 人类
```

要了解这之中的原因，首先要了解“||”的机制。
一般我们用“||”是用来进行布尔判断，前后都是布尔值，但是当其中一个不是布尔值时，它遵循以下原则:
>- 如果第一个操作数是对象，则返回第一个操作数。
- 如果第一个操作数的求值结果为false，则返回第二个操作数。
- 如果两个操作数都是对象，则返回第一个操作数。
- 如果两个操作数都是null，则返回null。
- 如果两个操作数都是NaN，则返回NaN。
- 如果两个操作数都是undefined，则返回undefined。

而且这是短路操作符，也就是说，如果第一个操作数的结果为true，则不会对第二个操作数求值了。
所以很多时候，我们也用“||” 来给变量定义默认值。如：`var a= str|| default`

&&的用法和||正好相反，它的机制是：
>- 如果第一个操作数是对象，则返回第二个操作数。
- 如果第二个操作数是对象，且只有第一个操作数的求值结果为true，则返回第二个操作数。
- 如果有一个操作数都是对象，则返回第一个操作数。
- 如果有一个操作数都是null，则返回null。
- 如果有一个操作数都是NaN，则返回NaN。
- 如果有一个操作数都是undefined，则返回undefined。

所以我们可以这么用
```javascript
    var typeMap = {"项链":"珠宝","苹果":"水果","仙人掌":"植物"};
    var type = (year>1) && typeMap[str];
```
上面这段话等同于
```javascript
if(year>1){
    if(str=="项链"){
        type="珠宝";
    }else if(str=="苹果"){
        type="水果";
    }else if(str=="仙人掌"){
        type="植物";
    }
}
```
然后我们还可以这样来
```javascript
    var typeMap = {"项链":"珠宝","苹果":"水果","仙人掌":"植物"};
    var type = ((year>1) && typeMap[str]) || "人类";
```
这段话等同于
```javascript
if(year>1){
    if(str=="项链"){
        type="珠宝";
    }else if(str=="苹果"){
        type="水果";
    }else if(str=="仙人掌"){
        type="植物";
    }else{
        type="人类";
    }
}else{
    type="人类";
}
```
卧槽，简直简便了好多对吧，不过为了维护性，还是不建议同时使用多个"&&" "||"，因为多了阅读起来就和阅读正则一样困难了。


讲了以上几个方法，至于到底要怎么做，还是要具体情况具体分析啦。