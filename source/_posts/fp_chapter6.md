title: 函数式编程-示例应用(译)
tags: web前端知识
---

翻译自[https://mostly-adequate.gitbooks.io/mostly-adequate-guide/](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)第六章

## 声明式代码

我们将要转变一下思想。从现在起，我们将不再告诉电脑怎么执行它的任务，取而代之的是指出明确希望得到的结果。我敢保证，这种做法与那种需要时刻关心所有细节的命令式编程相比，会让你轻松许多。

和命令式一步一步的指令相反，声明式则是书写表达式。

想一想SQL，它没有“第一步做这个，然后做那个”的命令，它只有一个详细说明我们想要从数据库获取的数据的表达式。我们不会替它决定怎么工作，它自己会处理。当数据库升级或者SQL引擎优化的时候，我们不需要去改变查询条件。因为有许多方式可以解析我们的表达式并且得到相同的结果。

对一些人来说，包括我，在一开始就掌握声明式代码的概念是很困难的。所以让我们通过一些例子来初步感受一下它：

```javascript
// 命令式
const makes = []
for (let i = 0; i < cars.length; i++) {
  makes.push(cars[i].make)
}

// 声明式
const makes = cars.map(car => car.make)
```

上面第一个命令式的循环，必须先声明这个数组。编译器必须在运行之前执行这个声明。然后它直接循环迭代过这个cars列表，手动的增加计数器，并且在明确的在迭代中用一种粗鲁的方式向我们展示它的零零散散的东西。

`map`版本则是一个表达式，它对执行没有顺序要求。它对这个map函数怎么迭代和怎么返回一个数组或集合有很大的自由。它指定了做什么而不是怎么做。因此它确实是声明式代码。

除了变得更加清楚和简洁外，还有一个好处：这个`map`函数随时可能会优化，但是我们珍贵的应用代码不需要做任何改动。

你可能会说："对，但是命令式的循环性能更快"，我建议你学习一下JIT是怎么优化你代码的。这里有一个很棒的[视频](https://www.youtube.com/watch?v=g0ek4vV7nEA)，可能会让你有所启发。

下面是另一个例子：

```javascript
// 命令式
const authenticate = (form) => {
  const user = toUser(form)
  return logIn(user)
}

// 声明式
const authenticate = compose(logIn, toUser)
```

尽管命令式版本的代码没有任何必然的错误，但是还是一个一步一步的编码。而这个`compose`表达式仅仅只是在声明一个事实：用户鉴权是`toUser`和`logIn`的组合。同样，这为代码改变提供了空间，让我们的应用代码成为了高阶规范。

在上面的例子中，运行顺序是被指定了的（`toUser`必须在`logIn`之前执行），但是还有很多顺序不重要的的场景，并且它在声明式代码中会很容易被指定（稍后详述）。

因为我们不需要编码指定运行顺序，所以声明式适用于并行运算。它与纯函数一起解释了为何函数式编程是未来并行计算的一个不错选择——我们真的不需要做什么特殊的事就能实现一个并行／并发系统

## 一个函数式编程的相册例子

我们会用声明式、组合的方式构建一个应用。我们现在仍然会作弊使用副作用，但是我们会保持这些副作用最小并且和我们核心的代码隔离。我们准备构建一个浏览器插件，吸收网络图片然后展示他们。让我们从搭建app的骨架开始：

下面是html代码：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Flickr App</title>
  </head>
  <body>
    <main id="js-main" class="main"></main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
    <script src="main.js"></script>
  </body>
</html>
```

然后这里是`main.js`的骨架：

```javascript
const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
const jquery = CDN('jquery/3.0.0-rc1/jquery.min');

requirejs.config({ paths: { ramda, jquery } });
requirejs(['jquery', 'ramda'], ($, { compose, curry, map, prop }) => {
  // app goes here
});
```

我们拉取了[ramda](https://ramdajs.com/)而不是lodash或者别的工具库。它包含了`compose`、`curry`和别的方法。我以前用过`requirejs`，它有一点重，但是为了保持一致性，我们会在本书中经常用到它。

有点跑题了，言归正传。我们的app会做4件事：

1. 为我们的特定搜索关键词构建一个url
2. 调用flickr api
3. 转换json结果到html图片中
4. 将它们显示到屏幕上

在上面有2个不纯净的方法，你知道是哪些么？它们是【从flickr api获取数据】和【将它们展现在屏幕上】。让我们先定义它们，这样就能隔离它们了。而且我会加入我们优秀的`trace`函数让调试更方便。

```javascript
const Impure = {
  getJOSN: curry((callback, url) => $.getJSON(url, callback)),
  setHtml: curry((sel, html) => $(sel).html(html))
  trace: curry((tag, x) => {
    console.log(tag, x);
    return x
  })
}
```

这里我们仅仅是用jQuery的方法包裹了了一层来实现柯里化，而且我们已经用更好的方式将参数进行交换。我将它们的命名空间命名为`Impure`来让我们知道这是一个危险的函数。在之后的例子中，我们会让它们变成2个纯洁的函数。

接下来，我们必须构造一个url来传入我们的`Impure.getJSON`函数：

```javascript
const host = 'api.flickr.com'
const path = '/services/feeds/photos_public.gne';
const query = t => `?tags=${t}&format=json&jsoncallback=?`;
const url = t => `https://${host}${path}${query(t)}`;
```

使用幺半群（我们稍后将会了解这些）或组合器，使用奇特和过于复杂的方式编写url pointfree。我们选择坚持使用可读版本并以正常的方式组装这个字符串。

让我们写一个app函数来执行调用和将内容放到屏幕上。

```js
const app = compose(Impure.getJSON(Impure.trace('response')), url)
app('cats')
```

它调用了我们的`url`函数，然后将url字符串传给已经被`trace`部分调用过的`getJSON`函数。运行程序可以看到api的响应展示在了控制台里
![console](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/images/console_ss.png)

我们希望通过这个json构建出图片列表，看起来图片地址在`mediaUrls`对象的`m`属性上。

总之，为了获得这些嵌套的属性，我们可以用一种非常普遍和友好的来自`ramda`名叫`prop`的函数。为了让你明白原理，下面是自己实现的的`prop`版本:

```js
const prop = curry((property, object) => object[property])
```

实际上这有点傻，我们仅仅是用了`[]`语法去获取一个对象上的属性。让我们用这个去获取我们的`mediaUrls`

```js
const mediaUrl = compose(prop('m'), prop('media))
const mediaUrls = compose(map(mediaUrl), prop('items'))
```

一旦我们获得了`items`, 我们必须用`map`来包裹它们以提取到每个图片的url。这返回了一个令人满意的`mediaUrls`的数组。让我们把它和应用连接起来并将他们打印在屏幕上。

```js
const render = compose(Impure.setHtml('#js-main'), mediaUrls)
const app = compose(Impure.getJSON(render), url)
```

上面我们所做的一切创建了一个新的组合，它会调用我们的`mediaurls`方法并且通过它们设置`<main>`html标签。我们已经将`trace`方法的调用替换成`render`方法，所以现在我们可以渲染一些除了json数据外的别的东西。它会在`body`里粗略地展示`mediaUrls`。

我们的最后一步是将这些`url`放进`<images>`标签。在一个大型应用中，我们习惯使用一个模板/dom库，比如
`handlebars`或者`React`。在这个应用中，我们只需要一个图片标签，所以我们使用`jQuery`。

```js
const img = src => $('<img />', { src });
```

jQuery的`html`方法接收一个标签的数组，我们只需要将图片地址转变成图片标签，然后将他们传入`setHtml`方法。

```js
const images = compose(map(img), mediaUrls);
const render = compose(Impure.setHtml('#js-main'), images);
const app = compose(Impure.getJSON(render), url);
```

现在我们大功告成了
![cats](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/images/cats_ss.png)

下面是完整的js代码:

```js
const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
const jquery = CDN('jquery/3.0.0-rc1/jquery.min');

requirejs.config({ paths: { ramda, jquery } });
require(['jquery', 'ramda'], ($, { compose, curry, map, prop }) => {
  // -- Utils ----------------------------------------------------------
  const Impure = {
    trace: curry((tag, x) => { console.log(tag, x); return x; }), // eslint-disable-line no-console
    getJSON: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((sel, html) => $(sel).html(html)),
  };

  // -- Pure -----------------------------------------------------------
  const host = 'api.flickr.com';
  const path = '/services/feeds/photos_public.gne';
  const query = t => `?tags=${t}&format=json&jsoncallback=?`;
  const url = t => `https://${host}${path}${query(t)}`;

  const img = src => $('<img />', { src });
  const mediaUrl = compose(prop('m'), prop('media'));
  const mediaUrls = compose(map(mediaUrl), prop('items'));
  const images = compose(map(img), mediaUrls);

  // -- Impure ---------------------------------------------------------
  const render = compose(Impure.setHtml('#js-main'), images);
  const app = compose(Impure.getJSON(render), url);

  app('cats');
});
```

看啊，多么美妙的声明式，只是在阐述事物是什么，而不是怎么变成那样。我们现在可以把每一行看作一个带有属性的公式，我们可以这些属性去推导分析我们的应用并且进行重构。

## 一个有原则的重构

这里有一些可以优化的地方——我们用`map`遍历每一项去获取图片地址，然后我们再遍历这个地址数组来将他们转变成img标签。这里有一条map和组合的规律：

```js
// map's composition law
compose(map(f), map(g)) === map(compose(f, g));
```

我们可以利用这个规律去优化我们的代码，让我们进行一次有原则的重构。

```js
// original code
const mediaUrl = compose(prop('m'), prop('media'));
const mediaUrls = compose(map(mediaUrl), prop('items'));
const images = compose(map(img), mediaUrls);
```

鉴于等式推导和纯函数的好处，我们可以在一行内调用`mediaUrls`和`images`

```js
const mediaUrl = compose(prop('m'), prop('media'));
const images = compose(map(img), map(mediaUrl), prop('items'));
```

现在我们已经整合了我们的`map`函数们，我们可以应用这个组合规律了：

```js
/*
compose(map(f), map(g)) === map(compose(f, g));
compose(map(img), map(mediaUrl)) === map(compose(img, mediaUrl));
*/

const mediaUrl = compose(prop('m'), prop('media'));
const images = compose(map(compose(img, mediaUrl)), prop('items'));
```

现在这家伙只会循环一次，并同时会转换它们的每一项变成一个img。现在让我们通过提取函数的方式，再把它变得可读性更强一点。

```js
const mediaUrl = compose(prop('m'), prop('media'));
const mediaToImg = compose(img, mediaUrl);
const images = compose(map(mediaToImg), prop('items'));
```

## 总结

我们已经见识了怎么把新技能运用到一个很小但很世界化的应用上。我们用了数学框架去进行推到并且重构代码。但是怎么进行错误处理和代码分支呢？我们怎么让整个应用都是纯洁的而不是仅仅把破坏性的函数放在命名空间下？怎么让我们的应用更安全更具有表现力呢？让我们在part2中处理这些问题。

相关：
[函数式编程-柯里化](https://blog.chenkeyi.com/blog/fp_chapter4-currying/)
[函数式编程-组合](https://blog.chenkeyi.com/blog/fp_chapter5-compose/)
