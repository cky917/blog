title: 正则表达式学习笔记
date: 2019-01-11 01:21:50
tags: Javascript学习笔记
---
[教程地址](https://zh.javascript.info/regular-expressions)
<!-- more -->

## 模式和修饰符
### 模式
即pattern，匹配reg
### 修饰符
- i 忽略大小写
- g 全部匹配
- m 多行模式
- u 开启完整的 unicode 支持
- y 粘滞模式

## [RegExp 和 String 的方法](https://zh.javascript.info/regexp-methods#shi-yonggxiu-shi-fu-de-strmatchreg)

### str.search(regexp)
`str.search(regexp)` 方法返回的是找到的匹配项的索引位置，如果没找到则返回 -1。重要提示：__search 总是查找第一个匹配项__。

### str.match(reg)
- 没有'g'修饰符情况下的`str.match(reg)`
`str.match(reg)` 只会查找第一个匹配项。
结果是一个数组，里面有该匹配项和额外的属性：
    - `index` – 匹配项在字符串中所处在的位置，
    - `input`– 原始字符串。
- 使用“g”修饰符的 `str.match(reg)`
当使用 `"g"` 修饰符的时候，`str.match` 就会返回由所有匹配项组成的数组。在数组中没有额外的属性，而且圆括号也不会创建任何元素。重要提示：__如果没有匹配项，将返回`null`__。

### str.split(regexp|substr, limit)
使用 regexp（或子字符串）作为分隔符分隔字符串。

### str.replace(str|reg, str|func)
搜索和替换字符串的利器。

```javascript
'12-34-56'.replace("-", ":") // 12:34-56
'12-34-56'.replace( /-/g, ":" ) // 12:34:56
```

第二个参数是要替换的字符串，可以使用特殊符号

```javascript
let str = "John Doe, John Smith and John Bull."
// 对于每个 John — 替换成 Mr.John
str.replace(/John/g, 'Mr.$&')
// "Mr.John Doe, Mr.John Smith and Mr.John Bull.";
let str = "John Smith";
str.replace(/(John) (Smith)/, '$2, $1') // Smith, John
```

对于那些需要“智能”替换的场景，第二个参数可以是函数。
函数参数：func(str, p1, p2, ..., pn, offset, s)

1. `str` — 匹配项，
2. `p1, p2, ..., pn` — 圆括号里的内容（如果有的话），
3. `offset` — 匹配项所在的位置，
4. `s` — 源字符串。

### regexp.test(str)

`test`方法查找任何符合的匹配，无论是否找到，都会返回 true/false。

### regexp.exec(str)
- 如果不使用 `g` 修饰符，则与 `str.match` 没有什么区别。
- 如果有 `g`，那么` regexp.exec(str)` 返回第一个匹配项，然后在 `regexp.lastIndex` 里 记住 该匹配项结束的的位置。下一次调用从 `regexp.lastIndex` 开始搜索，并且返回下一个匹配项。如果再没有匹配项了，则 `regexp.exec` 返回 `null`，`regexp.lastIndex`置为 0。

### y修饰符
`y` 修饰符意味着搜索应该并且只能在属性 `regexp.lastIndex`指定的位置查找匹配项。

```javascript
let str = "I love JavaScript!";
let reg = /javascript/iy;
reg.lastIndex  // 0（默认）
str.match(reg) // null, 没有在位置 0 上找到匹配项
reg.lastIndex = 7
str.match(reg)  // JavaScript（搜索正确，该单词确实在位置 7）
// 对于其它 reg.lastIndex，结果都为 null

```

`y` 修饰符非常适合解析器 — 一种需要“读取”文本、构建内存语法结构或者从中执行操作的程序。为此，我们沿着文本移动，应用正则表达式，来看下一个是字符串、数字还是其它。

`y` 修饰符在给定位置应用一个正则表达式（或者会有很多，逐个进行），当我们理解了其中的内容后，就可以继续一步步检查文本。

在没有该修饰符的情况下，引擎总是会检查到文本的末尾，这需要花费时间，尤其是当文本很大的时候，解析器将会很慢。`y` 修饰符在这里使用则恰到好处。

## 字符集合

- \d — 数字。

- \D — 非数字。

- \s — 空格标识，制表符，换行符。

- \S — 除了 \s 的所有。

- \w — 英文单词，数字，下划线 '_'。

- \W — 除了 \w 的所有。

- '.' — 除了一个换行符的任何字符。

## [转义，特殊字符](https://zh.javascript.info/regexp-escaping)

特殊字符列表： `[ \ ^ $ . | ? * + ( )` 

## [集合和范围[...]](https://zh.javascript.info/regexp-character-sets-and-ranges)

在方括号 `[…]`中的几个字符或者字符类意味着“搜索给定的字符中的任意一个”。

### 集合

```javascript
"Mop top".match(/[tm]op/gi) // "Mop", "top"
"Voila".match(/V[oi]la/) // null，并没有匹配上
```

### 范围

方括号也可以包含字符范围。

- \d —— 表示的意思和 [0-9] 一样，

- \w —— 表示的意思和 [a-zA-Z0-9_] 一样，

- \s —— 表示的意思和 [\t\n\v\f\r ] 加上其它一些 unicode 编码的空格一样。

我们也可以在 […] 内部使用字符类。

比如说，我们想要匹配所有单词字符或者短划线，类似像 “twenty-third” 之类的单词。我们不能使用 \w+ 来匹配，因为 \w 并不包含一个短划线。但是我们可以使用 [\w-] 来查找。

我们也可以使用字符类的组合来覆盖每个可能的字符，比如说像 [\s\S]。这会匹配任何空格或者非空格的字符 —— 也就是任何字符。这个匹配范围会比符号点 "." 的范围更广，因为点匹配只能匹配除了换行符之外的所有字符。

### 排除范围[^…]

它们通过在匹配查询的开头添加插入符号 ^ 来表示，它会匹配所有除了给定的字符之外的任意字符。

### 在[...]中不转义

在方括号表示中，绝大多数特殊字符可以在不转义的情况下使用

## [unicode 标记](https://zh.javascript.info/regexp-unicode)

unicide 标记` /.../u` 可以正确支持 UTF16 编码代理对。

## [量词 `+,*,?` 和 `{n}`](https://zh.javascript.info/regexp-quantifiers)

假设我们有一个字符串 +7(903)-123-45-67，并且想要找到它包含的所有数字。但与之前不同的是，我们对单个数字不感兴趣，只对全数感兴趣：7, 903, 123, 45, 67。

数字是一个或多个 \d 的序列。用来形容我们所需要的数量的词被称为量词。

### 数量 {n} 

- 确切的位数：{5}

`\d{5}` 表示 5 位的数字，如同`\d\d\d\d\d`。

- 某个范围的位数：{3,5} 来查找位数为 3 至 5 位的数字：\d{3,5}

- \d{n,} 就会查找位数大于或等于n 的数字：

    对于字符串 +7(903)-123-45-67 来说，我们如果需要一个或多个连续的数字，就使用 \d{1,}

### 缩写

大多数常用的量词都可以有缩写：

- `+` 代表一个或多个 相当于{1,}

    例如，\d+ 用来查找所有数字

- `?`  代表“零个或一个”，相当于 {0,1}。换句话说，它使得符号变得可选

- `*` 代表“零个或多个”，相当于{0,}。也就是说这个字符可以出现多次或不出现

## [贪婪量词和惰性量词](https://zh.javascript.info/regexp-greedy-and-lazy)

### 贪婪搜索

默认情况下，正则表达式引擎会尝试尽可能多地重复量词。例如，`\d+` 检测所有可能的字符。当不可能检测更多（没有更多的字符或到达字符串末尾）时，然后它再匹配模式的剩余部分。如果没有匹配，则减少重复的次数（回溯），并再次尝试。

### 懒惰模式

通过在量词后添加问号 ? 来启用。在每次重复量词之前，引擎会尝试去匹配模式的剩余部分。

## [捕获组](https://zh.javascript.info/regexp-groups)

正则模式的一部分可以用括号括起来 `(...)`，由此构成一个『捕获组』。

这有两个作用：

- 当使用 `String#match` 或 `RegExp#exec` 方法时，它允许你把匹配到的部分放到一个独立的数组项里面。

- 如果我们在括号之后加上量词，那么它会应用到这个整体，而非最后一个字符。

## [反向引用](https://zh.javascript.info/regexp-backreferences)

捕获组不仅能在结果中读取，也能在替换字符串，甚至模式中读取。

### 替换字符串中的组：$n

`replace` 方法中可以用 $n 在替换字符串中访问第 n 个捕获组。

```javascript
let name = "John Smith";
name = name.replace(/(\w+) (\w+)/i, "$2, $1"); // Smith, John

```

### 模式中的组: \n

```javascript

let str = "He said: \"She's the one!\".";
let reg = /(['"])(.*?)\1/g;
str.match(reg)  // "She's the one!"

```

正则表达式引擎匹配第一个引号 (['"]) 时，记录 pattern(...) 的内容，这就是第一个捕获组。

\1 的含义是“找到与第一组相同的文本”(存的是结果，不是条件)。

请注意：

- 在替换字符串内部引用组的方式 —— $1，在模式中引用组的方式 —— \1。

- 在组内使用 ?: 则无法引用到该组。正则表达式引擎不会记住被排除在捕获 (?:...) 之外的组。

## [选择(OR) |](https://zh.javascript.info/regexp-alternation)

```javascript
let reg = /html|php|css|java(script)?/gi;
let str = "First HTML appeared, then CSS, then JavaScript";
str.match(reg)   // 'HTML', 'CSS', 'JavaScript'

```

我们通常用圆括号把模式中的选择部分括起来，像这样 `before(XXX|YYY)after`。

匹配时间：

```javascript
let reg = /([01]\d|2[0-3]):[0-5]\d/g;
"00:00 10:10 23:59 25:99 1:2".match(reg)  // 00:00,10:10,23:59

```

## [字符串的开始符 ^ 和结束符 $](https://zh.javascript.info/regexp-anchors)

脱字符 `^` 匹配文本的开始，而美元符 `$` 匹配文本的结束。

## [Flag "m" — 多行模式](https://zh.javascript.info/regexp-multiline-mode)

通过 flag `/.../m` 可以开启多行模式。

这仅仅会影响 ^ 和 $ 锚符的行为。

在多行模式下，它们不仅仅匹配文本的开始与结束，还匹配每一行的开始与结束。

```javascript
let str = `1st place: Winnie
2nd place: Piglet
33rd place: Eeyore`;
str.match(/^\d+/gm) ; // 1, 2, 33
str.match(/\w+$/gim) // Winnie,Piglet,Eeyore
```

## [无限回溯问题](https://zh.javascript.info/regexp-infinite-backtracking-problem)

有些正则表达式看起来简单，但会执行很长很长的时间，甚至会“挂起” JavaScript 引擎。
典型的情况 —— 一个正则表达式有时候工作正常，但对于特定的字符串它会“挂起”占用 100% 的 CPU。

见文章