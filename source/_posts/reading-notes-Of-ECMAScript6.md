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
3. 从函数返回多个值。函数只能返回一个值，如果要返回多个值，只能将它们放在数组或对象里返回。有了解构赋值，取出这些值就非常方便。
4. 函数参数的定义，解构赋值可以方便地将一组参数与变量名对应起来。
```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);
// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```
5. 提取JSON数据。解构赋值对提取JSON对象中的数据，尤其有用。
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
6. 输入模块的指定方法,加载模块时，往往需要指定输入那些方法。解构赋值使得输入语句非常清晰。
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

### 数值的拓展
`Number.isFinite()`用来检查一个数值是否为有限的（finite）。
`Number.isNaN()`用来检查一个值是否为NaN。
它们与传统的全局方法isFinite()和isNaN()的区别在于，传统方法先调用Number()将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，非数值一律返回false。
```javascript
isFinite(25) // true
isFinite("25") // true
Number.isFinite(25) // true
Number.isFinite("25") // false
isNaN(NaN) // true
isNaN("NaN") // true
Number.isNaN(NaN) // true
Number.isNaN("NaN") // false
```
### 数组的拓展
`Array.from`方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）。
```javascript
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
Array.from('hello');// ['h', 'e', 'l', 'l', 'o'];
Array.from({ length: 3 });// [ undefined, undefined, undefined ]
```
Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
```javascript
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);
Array.from([1, 2, 3], (x) => x * x)// [1, 4, 9]
```
`Array.of`总是返回参数值组成的数组。如果没有参数，就返回一个空数组。`Array.of`基本上可以用来替代Array()或new Array()，并且不存在由于参数不同而导致的重载。它的行为非常统一。
```javascript
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```
### 对象的拓展
__属性的简洁表示法__
ES6允许直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。
```
var foo = 'bar';
var baz = {foo};
baz // {foo: "bar"}
// 等同于
var baz = {foo: foo};
function f(x, y) {
  return {x, y};
}
// 等同于
function f(x, y) {
  return {x: x, y: y};
}
f(1, 2) // Object {x: 1, y: 2}
```
__Object.keys()__
ES5 引入了Object.keys方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。
```javascript
var obj = { foo: 'bar', baz: 42 };
Object.keys(obj);// ["foo", "baz"]
```
__Object.values()__
Object.values方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。
```javascript
var obj = { foo: 'bar', baz: 42 };
Object.values(obj)// ["bar", 42]
```
__Object.entries__
`Object.entries`方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。
```javascript
var obj = { foo: 'bar', baz: 42 };
Object.entries(obj)// [ ["foo", "bar"], ["baz", 42] ]
```
### symbol
ES6引入了一种新的原始数据类型Symbol，__表示独一无二的值__。它是JavaScript语言的第七种数据类型，前六种是：Undefined、Null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。
[详见文档](http://es6.ruanyifeng.com/#docs/symbol)

### set
ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
Set本身是一个构造函数，用来生成Set数据结构。
```javascript
var s = new Set();
[2, 3, 5, 4, 5, 2, 2].map(x => s.add(x));
for (let i of s) {
  console.log(i);// 2 3 5 4
}
```
所以set可用来去除数组重复成员
```javascript
// 去除数组的重复成员
[...new Set(array)]
[...new Set([2,2,2,2,2,3])] //2,3
```
Set结构的实例有以下属性。
- `Set.prototype.constructor`：构造函数，默认就是Set函数。
- `Set.prototype.size`：返回Set实例的成员总数。

Set实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。
- `add(value)`：添加某个值，返回Set结构本身。
- `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `has(value)`：返回一个布尔值，表示该值是否为Set的成员。
- `clear()`：清除所有成员，没有返回值。

遍历方法：
- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回键值对的遍历器
- `forEach()`：使用回调函数遍历每个成员

### map
JavaScript的对象（Object），本质上是键值对的集合（Hash结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。Map结构提供了“值—值”的对应，是一种更完善的Hash结构实现。如果你需要“键值对”的数据结构，Map比Object更合适。

```javascript
var map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```
实例的属性和操作方法:
- `size`属性返回Map结构的成员总数。
- `set(key, value)`方法设置key所对应的键值，然后返回整个Map结构。如果key已经有值，则键值会被更新，否则就新生成该键。set方法返回的是Map本身，因此可以采用链式写法。
- `get(key)`方法读取key对应的键值，如果找不到key，返回undefined。
- `has(key)`方法返回一个布尔值，表示某个键是否在Map数据结构中。
- `delete(key)`方法删除某个键，返回true。如果删除失败，返回false。
- `clear()`方法清除所有成员，没有返回值。

遍历方法
- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回所有成员的遍历器。
- `forEach()`：遍历Map的所有成员。

### proxy
[proxy](http://es6.ruanyifeng.com/#docs/proxy)，文档再此，后续总结
### reflect
[reflect](http://es6.ruanyifeng.com/#docs/reflect)，文档再此，后续总结

### Iterator和for...of循环



