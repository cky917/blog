title: typescript学习笔记 - 基础类型、变量声明
date: 2018-02-28 10:48:00
tags: web前端知识
---
typescript学习笔记 - 基础类型、变量声明
<!-- more -->
## 基础类型
### 布尔值： 
```javascript
let isDone: boolean = false;
```

### 数字

```javascript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

### 字符串

```javascript
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

### 数组

```javascript
let list: number[] = [1, 2, 3];
//第二种方式是使用数组泛型，Array<元素类型>：
let list: Array<number> = [1, 2, 3];
```

### 元组 Tuple

```javascript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error

// 当访问一个已知索引的元素，会得到正确的类型：
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'

// 当访问一个越界的元素，会使用联合类型替代：
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
x[6] = true; // Error, 布尔不是(string | number)类型
```
### 枚举

```javascript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

// 默认情况下，从0开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从 1开始编号：
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;

// 或者，全部都采用手动赋值：
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

### Any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any类型来标记这些变量：

```javascript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

在对现有代码进行改写的时候，any类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。 你可能认为`Object`有相似的作用，就像它在其它语言中那样。 但是`Object`类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法：

```javascript
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

当你只知道一部分数据的类型时，any类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```javascript
let list: any[] = [1, true, "free"];
list[1] = 100;
```

### Void

某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```javascript
function warnUser(): void {
    alert("This is my warning message");
}
```

声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：

```javascript
let unusable: void = undefined;
```

### Null 和 Undefined
TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。 和 void相似，它们的本身的类型用处不是很大：

```javascript
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

默认情况下null和undefined是所有类型的子类型。 就是说你可以把 null和undefined赋值给number类型的变量。

然而，当你指定了`--strictNullChecks`标记，null和undefined只能赋值给void和它们各自。 这能避免 很多常见的问题。 也许在某处你想传入一个 `string或null或undefined`，你可以使用联合类型`string | null | undefined`。
> 注意：我们鼓励尽可能地使用--strictNullChecks

### Never
`never`类型表示的是那些永不存在的值的类型。 例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never`类型，当它们被永不为真的类型保护所约束时。

```javascript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

### 类型断言
有时候你会遇到这样的情况，你会比TypeScript更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

类型断言有两种形式。 其一是“尖括号”语法：

```javascript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

另一个为as语法：

```javascript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有 `as`语法断言是被允许的。

## 变量声明

### 变量与作用域
推荐使用`let`和`const`，基本用法同javascript

### 解构

#### 数组解构

基本用法同javascript
作用域函数参数：
```javascript
function f([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}
let input = [1, 2];
f(input);
```

你可以在数组里使用`...`语法创建剩余变量：

```javascript
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
```

#### 对象解构

```javascript
let {a, b}: {a: string, b: number} = o;
```
默认值可以让你在属性为 undefined 时使用缺省值：

```javascript
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}
```

### 展开

基本用法同javascript

对象展开还有其它一些意想不到的限制。 首先，它仅包含对象 自身的可枚举属性。 大体上是说当你展开一个对象实例时，你会丢失其方法：

```javascript
class C {
  p = 12;
  m() {
  }
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // error!
```

摘抄自 [typescrpit中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)