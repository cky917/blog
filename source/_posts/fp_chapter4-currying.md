title: 函数式编程-柯里化(译)
tags: web前端知识
---

我发现又能学英语又能不耽误学技术的最好方法就是看英文的技术文档和教程- -
而翻译文档可以又既加深英语理解，又能加深对文档的记忆和理解，真是一举多得😂

翻译自[https://mostly-adequate.gitbooks.io/mostly-adequate-guide/](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)第四章
翻译by: cky
<!-- more -->

## 必不可少的柯里化

我爸爸曾经向我描述过，在某些东西获得之前能够正常生活，但是你得到之后，它们就变得不可或缺了。微波炉是一个例子，智能手机、互联网也是--老一辈的人没有它的时候也过得很好。对于我来说，柯里化是其中一个。

柯里化的概念很简单：你可以用比函数期望的参数少的参数去调用那个函数，它返回一个函数接受剩下的参数。

你可以选择一次性用全部参数去调用它，也可以仅仅传递少量的参数分多次调用。

```javascript
const add = x => y => x + y;
const increment = add(1);
const addTen = add(10);

increment(2); // 3
addTen(2); // 12
```

上面我们定义了一个`add`函数，它接受一个参数，并返回一个函数。通过调用，它返回的函数由于闭包记住了最开始传进去的参数。如果一次性传递2个参数去调用它会很麻烦，所以我们可以用一个特殊的工具函数 --- `curry`来帮助我们像这样更简单地定义和调用函数。

让我们创建一些柯里化函数来享受一下。从现在起，我们调用的`curry`函数是被定义在[附录A](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/appendix_a.html)中的`curry`

```javascript
const match = curry((what, s) => s.match(what))
const replace = curry((what, replacement, s) => s.replace(what, replacement))
const filter = curry((f, xs) => xs.filter(f))
const map = curry((f, xs) => xs.map(f))
```

上面我所遵循的是一个很简单但是很重要的公式，我战略性地把我们需要操作的数据(String, Array)放在最后一个参数的位置，在使用它们之后你就知道为什么了。

```javascript
match(/r/g, 'hello world') // ['r']

const hasLetterR = match(/r/g) // x => x.match(/r/g)
hasLetterR('hello world') // ['r']
hasLetterR('just j and s and t ect') // null

filter(hasLetterR, ['rock and roll', 'smooth jazz']) // ['rock and roll']

const noVowels = replace(/[aeiou]/ig); // (r,x) => x.replace(/[aeiou]/ig, r)
const censored = noVowels('*'); // x => x.replace(/[aeiou]/ig, '*')
censored('Chocolate Rain'); // 'Ch*c*l*t* R**n'
```

上面演示了一种“预加载”函数的能力，使用一个或两个参数去调用之后返回一个新的能够记住之前参数的函数。

我鼓励你clone这个仓库, (git clone <https://github.com/MostlyAdequate/mostly-adequate-guide.git)> 拷贝上面的代码然后在REPL里尝试一下。和在附录里定义的任何一个柯里化函数一样，在support/index.js模块里也可以使用。

或者，也可以看看发布在`npm`里的版本

```javascript
npm install @mostly-adequate/support
```

## More Than a Pun / Special Sauce

柯里化对于很多事都非常有用。我们可以仅仅给基础函数一些参数来创建一个新函数，就像`hasLetterR`、`removeStringsWithoutRs`和`censored`。

用`map`函数包裹一个函数，可以将一个只接受单个元素作为参数的函数变成能接受一个数组作为参数的函数。

```javascript
const getChildren = x => x.childNodes
const allTheChildren = map(getChildren)
```

用少量参数去调用函数通常被称为局部调用。局部调用一个函数可以减少大量的样板代码。考虑一下上面的`allTheChildren`函数如果和没有被柯里化的`lodash`里的`map`函数共同作用的情况(注意参数的顺序不一样了):

```javascript
const allTheChildren = elements => map(elements, getChildren)
```

我们通常不会直接定义操作数组的函数，因为我们可以仅仅在一行里调用`map(getChildren)`。`sort`、`filter`以及其他高阶函数（高阶函数是一个返回函数的函数）也一样。

当我们在说__纯函数__的时候，我们其实在说的是一个输入一定对应一个输出。柯里化正式如此：每传入一个参数都会返回一个处理余下参数参数的函数。这就是一个输入对应一个输出，尽管输出的是另一个函数，它也是一个纯函数。有时我们确实允许接受超过一个函数，但是这被认为是仅仅为了减少更多`()`的方便。

## 总结

柯里化很便利而且我非常享受在日常工作中使用柯里化函数。它是一个必备的工具，让函数式编程不那么冗杂和乏味。

我们可以通过传入一些参数来实时创建一个新的有用的函数，而且带来了额外的好处，我们保留了数学的函数定义，尽管参数不止一个。
