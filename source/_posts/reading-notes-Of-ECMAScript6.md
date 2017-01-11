title: 《ECMAScript 6 入门》读书笔记
tags: 读书笔记
---
### let与const
#### let
* 块级作用域
* 不存在变量提升
* 暂时性死区
* 不允许重复声明

#### const
* const声明一个只读的常量。一旦声明，常量的值就不能改变。
* const一旦声明变量，就必须立即初始化，不能留到以后赋值。
* 暂时性死区
* 不允许重复声明
* 将一个对象声明为常量必须非常小心，只是保持了指向的地址不变，不保证指向的数据不变。

### 变量的解构赋值
__用处__:

1. 对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。
`let { log, sin, cos } = Math;`
2. 交换变量的值。`[x,y] = [y,x]`
3. 从函数返回多个值。
4. 函数只能返回一个值，如果要返回多个值，只能将它们放在数组或对象里返回。有了解构赋值，取出这些值就非常方便。
5. 函数参数的定义，解构赋值可以方便地将一组参数与变量名对应起来。
```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```
6. 提取JSON数据。解构赋值对提取JSON对象中的数据，尤其有用。
```javascript
var jsonData = {
    id: 42,
    status: "OK",
    data: [867, 5309]
};
let { id, status, data: number } = jsonData;
console.log(id, status, number);
// 42, "OK", [867, 5309]
```
7. 输入模块的指定方法,加载模块时，往往需要指定输入那些方法。解构赋值使得输入语句非常清晰。
```javascript
const { SourceMapConsumer, SourceNode } = require("source-map");
```
### 字符串扩展
传统上，JavaScript只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6又提供了三种新方法。
- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在源字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在源字符串的尾部。

这三个方法都支持第二个参数，表示开始搜索的位置。
```
var s = 'Hello world!';
s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```
上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。