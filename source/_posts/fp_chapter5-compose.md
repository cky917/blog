title: 函数式编程-组合(译)
date: 2019-07-30 18:581:21
tags: web前端知识
---
翻译自[https://mostly-adequate.gitbooks.io/mostly-adequate-guide/](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)第五章

<!-- more -->

## 函数饲养（Functional Husbandry)

`compose`的实现：

```javascript
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
```

...不要害怕！这是9000级的超级赛亚人形式。为了推导，让我们删除可变参数，实现并考虑一个可以组合两个函数的简单形式。一旦你了解了它，你就可以理解更抽象的概念，并且会觉得对于很多函数作为参数也非常简单（我们可以证明）！这里有一个更友好的`compose`形式：

```javascript
const compose2 = (f, g) => x => f(g(x))
```

`f`和`g`是两个函数，而`x`则是`被运输`(piped)穿过他们的值。

`Composition`像一个函数饲养的过程。你是函数们的饲养员，选择两个你想要结合的特征并将它们混合在一起产生一个全新的特征。就像下面这样:

```javascript
const toUpperCase = x => x.toUpperCase();
const exclaim = x => `${x}!`;
const shout = compose(exclaim, toUpperCase);

shout('send in the clowns'); // "SEND IN THE CLOWNS!"
```

这2个函数的组合返回了一个新函数。组合两个类型的单元（在这种情况下是函数）应该产生这种类型的新单元，这正是我们想要的。You don't plug two legos together and get a lincoln log. 我们总会在适当的时候发现一些基本的法则.

在我们对`compose`的定义中，`g`会在`f`之前返回，创造出一个从右到左的数据流。这比一组嵌套的函数调用可读性强多了。如果不用`compose`, 会是下面这样

```javascript
const shout = x => exclaim(toUpperCase(x))
```

我们从右往左运行，而不是从里向外运行，我觉得可以称之为“左倾”（嘘）。让我们看一下运行顺序重要的例子。

```javascript
const head = x => x[0]
const reverse = reduce((acc, x)) => [x].concat(acc), [])
const last = compose(head, reverse)

last(['jumpkick', 'roundhouse', 'uppercut']) // 'uppercut
```

`reverse`会返回一个反向列表，而`head`则取出它们中的第一个项。这实现了一个尽管效率低但是有效的`last`功能。函数在组合中的运行顺序很显而易见了，我们也可以定义一个从左到右的版本，但是，我们这个版本更接近数学的表示。没错，组合是来源于数学书的。也许是时候看一下适用于任何组合的规律了。

```javascript
compose(f, compose(g, h)) === compose(compose(f, g), h);
```

`Composition`是可组合的，意味着你怎么组织它们中的2个并不重要。所以，如果我们要将字符串大写的话，可以这样写：

```javascript
compose(toUpperCase, compose(head, reverse));
// or
compose(compose(toUpperCase, head), reverse);
```

可以看出，我们怎么组织我们的组合调用并不重要，他们的结果都是一样的。它允许我们写一个可变参数，并且按照如下方法使用它。

```javascript
// previously we'd have to write two composes, but since it's associative,
// 目前我们必须写2个组合式，但是他们都是符合结合律的
// we can give compose as many fn's as we like and let it decide how to group them.
// 我们可以组合任意想要的数量的函数，然后让它自己决定如何分组
const arg = ['jumpkick', 'roundhouse', 'uppercut'];
const lastUpper = compose(toUpperCase, head, reverse);
const loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

lastUpper(arg); // 'UPPERCUT'
loudLastUpper(arg); // 'UPPERCUT!'
```

结合律的应用让我们的使用更灵活，而且更加高枕无忧，因为结果都是一致的。The slightly more complicated variadic definition is included with the support libraries for this book and is the normal definition you'll find in libraries like lodash, underscore, and ramda.

结合律一个令人满意的好处是，任何一组函数都可以在它们自己的组合中被提取和绑定在一起。让我们重构一下之前的例子：

```javascript
const loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

// -- or ---------------------------------------------------------------

const last = compose(head, reverse);
const loudLastUpper = compose(exclaim, toUpperCase, last);

// -- or ---------------------------------------------------------------

const last = compose(head, reverse);
const angry = compose(exclaim, toUpperCase);
const loudLastUpper = compose(angry, last);
```

我们只是在按照我们喜欢的方式拼乐高，没有对错之分。通常，最好以一种可重用的方式去分组，例如`last`和`angry`方法。一个熟悉Fowler的“重构”的人可能会认为这个过程是“提取函数”...除非所有的对象状态都不需要担心。

## Pointfree

Pointfree风格的意思是永远不必说出你的数据，这意味着函数从不提及其操作所依据的数据。一等函数、柯里化和组合作用在一起产生了这种风格。

> 提示: Pointfree版本的`replace`和`toLowerCase`被定义在[Appendix C - Pointfree Utilities](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/appendix_c.html),不要犹豫快去看。

```javascrit
// 不是pointfree，因为提到了数据：word
const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_');

// pointfree
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

看我们是怎么部分应用`replace`的？我们所做的就是通过每个函数的一个参数来管理我们的数据。柯里化允许我们准备每个函数以获取它的数据，对其进行操作然后传递它。还有值得注意的事就是，在pointfree版本中，我们怎么做到不需要数据去构造我们的函数，而pintful形式中，我们必须在之前提供`word变量`.

让我们看看另一个例子：

```javascript
// 不是pointfree，因为提到了数据：name
const initials = name => name.split(' ').map(compose(toUpperCase, head)).join('. ');

// pointfree
// NOTE: we use 'intercalate' from the appendix instead of 'join' introduced in Chapter 09!
// 注意：我们使用了来自附录的`intercalate`方法代替将会在第九章介绍到的`join`方法
const initials = compose(intercalate('. '), map(compose(toUpperCase, head)), split(' '));

initials('hunter stockton thompson'); // 'H. S. T'
```

Pointfree风格的代码可以帮助我们移除掉不需要的命名，让我们的代码保持简洁和通用。
Pointfree是函数式代码的一个很好的试金石，因为它能告诉我们一个函数是否是接受输入返回输出的小函数，比如，while循环是不能组合的。不过你要小心，pointfress其实是一把双刃剑，它有时会让意图变得模糊。不是所有的函数式代码都是pointfree的，那也没关系，我们在可以用的时候使用它，不然就使用普通函数就行。

## Debugging

组合的一个常见错误是，在没有局部调用之前，就组合类似 map 这样接受两个参数的函数。

```javascript
// wrong - we end up giving angry an array and we partially applied map with who knows what.
// 错误 - 我们传给了 `angry` 一个数组，然后用一个不知道是什么的数据传给 `map` 进行部分调用。
const latin = compose(map, angry, reverse);

latin(['frog', 'eyes']); // error

// right - each function expects 1 argument.
const latin = compose(map(angry), reverse);

latin(['frog', 'eyes']); // ['EYES!', 'FROG!'])
```

如果你不知道怎么去调试一个组合，我们可以用一个有用但是不太纯净的`trace`函数去分析到底发生了什么。

```javascript
const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const dasherize = compose(
  intercalate('-'),
  toLower,
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire');
// TypeError: Cannot read property 'apply' of undefined
```

这里报错了，让我们用`trace`函数看看：

```javascript
const dasherize = compose(
  intercalate('-'),
  toLower,
  trace('after split'),
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire');
// after split [ 'The', 'world', 'is', 'a', 'vampire' ]
```

哈！我们需要使用`map`来执行`toLower`，因为它执行在一个数组上

```javascript
const dasherize = compose(
  intercalate('-'),
  map(toLower),
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire'); // 'the-world-is-a-vampire'
```

为了调试，我们可以用`trace`函数观察某个点上的数据，像`Haskell`和`PureScript`这样的编程语言一样有相似的功能，以方便开发。
组合可以成为我们构建程序的工具，而且很幸运的是，它背后有一个很强大的理论来支撑其正确性。让我们来深入看看这个理论。

## 范畴论 (Category Theory)

范畴论是一个数学里的抽象分支，能够形式化诸如集合论（set theory）、类型论（type theory）、群论（group theory）以及逻辑学（logic）等数学分支中的一些概念。范畴学主要处理对象（object）、态射（morphism）和变化式（transformation
)，而这些和编程联系很紧密。下图是一个相同概念在不同理论中展示：

![](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/images/cat_theory.png)

不好意思，我并没有吓唬你的意思，我并不期望你对这些概念很熟悉，我的意图是向你展示我们这里面有多少重复的内容，所以我们可以了解到为什么范畴论的目标是统一这些概念。

在范畴论中，有一个概念叫范畴，它定义了以下组件的集合：

- 一个对象的集合
- 一个态射（morphisms）的集合
- 一个关于态射组合的概念
- identity -- 区分态射

范畴论是一个模型化很多事情的非常抽象的概念，但是我们现在更关心的是，让我们将它应用到类型和函数中。

__一个对象的集合__: 对象们可能是数据类型，例如`String`,`Boolean`,`Number`,`Object`等等。我们经常把数据类型看作所有可能值的集合。`Boolean`可能被看作`[true, false]`的集合，`Number`被看作所有可能的数值的集合。把类型看作一个集合是很有用的，因为我们可以将集合论（set theory）运用在它们之中。

__一个态射的集合__: 态射是我们每天都在使用的标准纯函数

__一种被称为同一性的独特形态__: 正如你猜的那样，这就是我们的新玩具--`compose`。我们已经讨论过，`compose`函数是关联的，这不是巧合，因为范畴论中任何的组合都必须具备的性质。

这张图展示了什么是组合：
![](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/images/cat_comp1.png)
![](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/images/cat_comp2.png)

这里有一个具体的例子：

```javascript
const g = x => x.length
const f = x => x === 4
const isFourLetterWord = compose(f, g)
```

__一种被称为同一性的独特形态__: 让我们介绍一个很有用的`id`函数。这个函数仅仅是接受输出然后将它原样吐出来给你。

```JavaScript
const id = x => x
```

你可能在心里问自己：“这到底哪儿有用了？”。我们会在后面的章节将它用到更广泛的地方，但是现在把它看做一个能代替我们数据的函数 --- 一个函数伪装成普通数据的函数

`id`和组合一起使用简直完美。下面有一个特性，对所有的一元函数都成立：

```javascript
compose(id, f) === compose(f, id) === f
```

嘿，这个就像数字里的同一性！如果你还没搞清楚，花点时间想一想，明白它的无用性。我们很快会将`id`用到各种地方了，但是现在我们将它看做一个扮演者被传入值的替身的函数。这对于书写pointfree代码非常有用。

这是关于类型和函数的范畴。如果这是你第一次接触这个概念，我可以想象你仍然对范畴是什么以及它为什么有用有一点懵逼。没关系，我们整本书都建立于这个概念之上，截止目前，在这个章节这一行，你至少可以了解到它提供给我们关于组合的很好的知识 --- 也就是：结合律和同一律

还有什么别的范畴呢？当然，我们可以定义一个有向图，用节点为对象，用态射为边，用组合为连接路径。我们可以用数字当做对象，用`>=`当做态射（实际上任何偏序或全序都可以是一个范畴）。范畴有很多很多，但是在本书中，我们只需要了解上面定义的内容就可以。我们已经充分浏览的这些表面知识，是时候前进了。

## 总结

函数组合将我们的函数向一系列管道一样连接到一起，数据会也一定会流动穿过我们的应用---毕竟纯函数输入对应输出的，所以断掉这个链条会忽略掉输出，让我们的软件变得无用。

我们认为组合是高于其他设计原则的设计原则，因为它让我们的app保持简单而且富有可读性。范畴学在app构建、模拟副作用和保证正确性方面扮演重要角色。


相关：
[函数式编程-柯里化](https://blog.chenkeyi.com/blog/fp_chapter4-currying/)