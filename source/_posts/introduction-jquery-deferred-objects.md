title: 关于jQuery的Deferred对象介绍（译）
date: 2016-03-25 17:28:50
tags: web前端知识
---

(趁着毕设要求，翻译了一篇文章，顺便放上来。英文不好翻了2天才翻完，/(ㄒoㄒ)/~~如有错误欢迎指正。)
原文链接:[An Introduction to jQuery’s Deferred Objects](http://www.sitepoint.com/introduction-jquery-deferred-objects/)

长久以来，javascript的开发者习惯于使用回调函数去执行某些任务。一个常见的例子就是当某些事件比如`click`或者`keypress`执行的时候，通过`addEventListener()`添加回调函数。这样做的好处是，回调函数很简单，让工作能够很方便地完成，不幸的是，当你的网页变得越来越复杂而且你需要执行许多异步请求时，它们变得越来越难以处理。

ECMAScript2015引进了一个原生的方法去处理这种情况：promise。如果你不知道什么是promise，你可以读一读这篇文章[An Overview of JavaScript Promises](http://www.sitepoint.com/overview-javascript-promises/)。jQuery推出了它自己风格的promise，就是 __Deferred对象__ 。它在promise被引入ECMAScript之前几年就被引入了jqurey，在这篇文章里，我会讨论一下什么是`Deferred`对象，还有它解决了什么问题。

## 一个简单的历史介绍
`Deferred`对象在jQuery1.5版本被引入，它能让回调函数成为一个回调队列，继而被链式调用，它还能处理同步或者异步函数的成功或者失败状态。从此以后，它成为了一个课题被讨论和研究，也有一些批评的声音，伴随着批评和它也发生了许多改变。这里有两篇对它的批判性的文章：[You’re Missing the Point of Promises](https://blog.domenic.me/youre-missing-the-point-of-promises/)和[JavaScript Promises and why jQuery implementation is broken](https://thewayofcode.wordpress.com/tag/jquery-deferred-broken/)。

连同[Promise对象](http://api.jquery.com/Types/#Promise),Deferred代表了jQuery对于Promises的实现。在jQuery1.X版本和2.x版本里，deferred对象依附于[the CommonJS Promises/A proposal](http://wiki.commonjs.org/wiki/Promises/A)，这个提案被作为[Promises/A+ proposal](https://promisesaplus.com/)的基础，而原生的promises就是在此基础上建立的。正如前面所提到的，jQuery没有依附于 Promises/A+的原因是它在这之前就已经产生了。

因为jQuery是一个先驱者，还由于向后兼容问题，在原生javascript里使用promise与在jQuery1.x、2.x版本里使用都有一些区别。而且，由于jQuery遵循了一个不同的提案，这个框架和其他实现了promises的框架比如[the Q library](https://github.com/kriskowal/q)是互不兼容的。

在即将到来的 __jQuery 3__ 版本里，改进了与原生的Promises(在ECMAScript 2015被实现的)的兼容性。虽然有些主要的方法（then())还是由于向后兼容的原因和原生的Promises有些差别，但是其使用习惯已经越来越接近规范标准了。

<h2 id="callbackJquery">jQuery中的回调</h2>
为了理解为什么你需要使用`Deferred`对象，让我们先讨论一个例子。当你使用jQuery的时候，一定经常使用它的ajax方法去处理异步请求。为了理解这个例子，让我们假设你正在开发一个网页并且正在向Github的API发送Ajax请求。你的目标是收到用户的仓库列表，找到最近更新过的仓库，找到第一个名为'README.md'的文件，最终接收到这个文件的内容。基于以上的描述，你每一个Ajax请求可能都会是在上一个步骤完成的时候发送，换句话说，这些请求必须在一个队列中执行。

让我们把这些描述转换为代码（请注意我没有使用真的Github的API），我们得到以下代码：
```javascript
var username = 'testuser';
var fileToSearch = 'README.md';

$.getJSON('https://api.github.com/user/' + username + '/repositories', function(repositories) {
  
  var lastUpdatedRepository = repositories[0].name;

  $.getJSON('https://api.github.com/user/' + username + '/repository/' + lastUpdatedRepository + '/files', function(files) {
    var README = null;

    for (var i = 0; i < files.length; i++) {
      if (files[i].name.indexOf(fileToSearch) >= 0) {
        README = files[i].path;

        break;
      }
    }

    $.getJSON('https://api.github.com/user/' + username + '/repository/' + lastUpdatedRepository + '/file/' + README + '/content', function(content) {
      console.log('The content of the file is: ' + content);
    });
  });
});

```
正如你在这个例子里看到的，为了达到目的，我们必须嵌套执行Ajax请求。这让我们的代码变得可读性比较差。在我们必须嵌套使用大量的回调，或者需要一个独立的回调函数需要和另一个函数以同步的方式执行时，我们通常称这种情况为“回调地狱”。

为了让这种情况变好一点，你可以将我上面写的匿名函数提取出来命名。然而，这样改变也没啥帮助，我们仍然发现我们身处于回调地狱中。下面，我们就走进`Deferred`对象和`Promise`对象吧。

## Deferred对象和Promise对象
Deferred对象可以在执行异步操作的时候使用，比如Ajax请求和动画。在jQuery里，`Promise`对象创建于`Deferred`对象或者`jQuery`对象。它拥有`Deferred`对象下的方法，如：`always()`,`done()`,`fail()`,`state()`,和`then()`。我会在下面介绍这些方法。

如果你是来自原生javascript世界的，你可能会对这两个对象的存在感到很困惑。为什么我们要有两个对象（`Deferred`和`Promise`），而原生Javascript只有一个（`Promise`)？为了解释他们的不同和他们的用例，我在我的书中对他们进行了类比[jQuery in Action, Third Edition](https://www.manning.com/books/jquery-in-action-third-edition)。

一个使用`Deferred`对象的典型情况是，如果你正在编写一个函数去处理异步操作，并且可能会返回一个值（返回一个错误或者不返回值也行）。在这种情况下，你的函数是值的“生产者”，而且你希望阻止用户去改变`Deferred`的状态。当你是这个函数的消费者时，你就要使用`promise`。

为了阐明这个观点，让我们假设你希望实现一个基于promise的 `timeout()`方法(下面是这个[例子的代码](#creatingapromisebasedsettimeoutfunction)。你负责写这个函数，但是必须等到获得一个时间的数字（在这个等待的情况下没有值返回），这让你成为一个“生产者”。你这个函数的“消费者”不需要关心去resolve它或者reject它，“消费者”只需要能够在Deferred执行完成后、失败后、或者进程中添加函数。另外，你想要确保你的“消费者”不能resolve或reject这个Deferred对象。为了达到这个目标，你需要在你创建的`timeoout()`函数中返回`Deferred`的`promise`对象，而不是`Deferred`对象本身。这样做之后，你能确保除了你的`timeout()`函数以外，没有人能够调用`resolve()`和`reject()`方法。

你可以在[StackOverflow question](http://stackoverflow.com/questions/17308172/deferred-versus-promise)了解更多关于jQuery的Deferred对象和Promise对象的区别。

现在你知道这些对象是什么了，让我们来了解一下这些方法的作用。

## Deferred对象的方法
`Deferred`对象非常灵活，提供了很多方法满足你的需求。它可以被创建为`jQuery.Deferred()`，方法如下：
```javascript
var deferred = jQuery.Deferred();
```
或者，你也可以用`$`创建：
```javascript
var deferred = $.Deferred();
```
一旦创建，这个`Deferred`对象就暴露了一些方法，除了那些不赞成使用的和被移除的方法，它暴露的方法有：

- `always(callbacks[, callbacks, ..., callbacks]):` 在无论Deferred对象resolved还是rejected的时候都会执行。
- `done(callbacks[, callbacks, ..., callbacks]):` 当Deferred对象resolved的时候执行。
- `fail(callbacks[, callbacks, ..., callbacks]):` 当Deferred对象rejected的时候执行。
- `notify([argument, ..., argument]):` 根据给定的 args参数 调用Deferred对象上进行中的回调 （progressCallbacks）。
- `notifyWith(context[, argument, ..., argument]):` 根据给定的上下文（context）和args递延调用Deferred对象上进行中的回调（progressCallbacks ）。
- `progress(callbacks[, callbacks, ..., callbacks])`:当Deferred（延迟）对象生成进度通知时，调用添加处理程序。
- `promise([target]):` Return a Deferred‘s Promise object.
- `reject([argument, ..., argument]):` 拒绝Deferred（延迟）对象，并根据给定的args参数调用任何失败回调函数（failCallbacks）。
- `rejectWith(context[, argument, ..., argument]): `拒绝Deferred（延迟）对象，并根据给定的 context和args参数调用任何失败回调函数（failCallbacks）。
- `resolve([argument, ..., argument]):` 解决Deferred（延迟）对象，并根据给定的args参数调用任何完成回调函数（doneCallbacks）。
- `resolveWith(context[, argument, ..., argument]):` 解决Deferred（延迟）对象，并根据给定的 context和args参数调用任何完成回调函数（doneCallbacks）。
- `state():`确定一个Deferred（延迟）对象的当前状态。
- `then(resolvedCallback[, rejectedCallback[, progressCallback]]):` 当Deferred（延迟）对象解决，拒绝或仍在进行中时，调用添加处理程序。

通过这些方法的描述，让我们能够更明显地了解到jQuery文档中的术语和ECMAScript标准里的区别。在ECMAScript标准里，一个promise对象被称作resolved是在他完成或者被拒绝的时候。然而，在jQuery文档里，resolved描述的只是在ECMAScript中的完成状态。

Deferred提供了大量的方法，在本篇文章中不能全部介绍到。不过，在下面的内容中，我会展示一些`Deferred`对象和`Promise`对象的使用的例子。首先，我来会用Deferred对象重写一下在[jQuery中的回调](#callbackJquery)中的那段代码，然后我会把“生产者和消费者”的比喻再解释一下。

## 用Deferred对象完成Ajax请求队列
在这个章节我会展示怎么用Deferred对象和它的一些方法去提高[jQuery中的回调](#callbackJquery)里的那段代码的可读性，在开始探索之前，我们必须要明白我们需要用到哪些方法。

根据我们的需求和上面列出的方法列表，很明显我们可以用`done()`或者`then()`方法去管理成功的状态。由于你们大多数可能已经习惯于使用Javascript的`Promise`对象，在这个例子中，我会选择使用`then()`方法。在这两个方法最重要的一个区别是`then()`方法能够
将接收到的值作为参数传递给其他在后面调用的`then()`、`done()`、`fail()`或`progress()`方法。

最后的代码：
```javascript
var username = 'testuser';
var fileToSearch = 'README.md';

$.getJSON('https://api.github.com/user/' + username + '/repositories')
    .then(function(repositories) {
        return repositories[0].name;
    })
    .then(function(lastUpdatedRepository) {
        return $.getJSON('https://api.github.com/user/' + username + '/repository/' + lastUpdatedRepository + '/files');
    })
    .then(function(files) {
        var README = null;

        for (var i = 0; i < files.length; i++) {
            if (files[i].name.indexOf(fileToSearch) >= 0) {
                README = files[i].path;

                break;
            }
        }

        return README;
    })
    .then(function(README) {
        return $.getJSON('https://api.github.com/user/' + username + '/repository/' + lastUpdatedRepository + '/file/' + README + '/content');
    })
    .then(function(content) {
        console.log(content);
    });
```

正如你看到的，这段代码比之前的可读性好了很多，因为我们能把每一个步骤拆开看，它们都同一级，没有嵌套。

<h2 id="creatingapromisebasedsettimeoutfunction">创造一个基于Promise的setTimeout函数</h2>
你也许知道，`setTimeout()`能在指定的时间后执行回调函数。它的两个元素（回调函数和时间）都应该作为参数被提供。让我们假设你想要1秒后在控制台打印一段信息。使用`setTimeout()`，你可以达到这个目的：

```javascript
setTimeout(
  function() {
    console.log('I waited for 1 second!');
  },
  1000
);
```

正如你所见，第一个参数是一个想要被执行的函数，第二个是多少需要等待的毫秒数。这个函数一向很有用，但是如果你想用通过`Deferred`队列实现呢？

在下面我会告诉你怎么用jQuery提供的`Promise`对象完成一个基于promise的`setTimeout()`函数。

最后的代码：
```javascript
function timeout(milliseconds) {
    // Create a new Deferred object
    var deferred = $.Deferred();

    // Resolve the Deferred after the amount of time specified by milliseconds
    setTimeout(deferred.resolve, milliseconds);

    // Return the Deferred's Promise object
    return deferred.promise();
}

timeout(1000).then(function() {
    console.log('I waited for 1 second!');
});
```
我定义了一个`timeout()`函数，包裹了javaScript的原生`setTimeout()`方法。在`timeout()`方法里我创建了一个新的`Deferred`对象去管理异步任务，在`milliseconds`时间后`deferred`对象被设置为resolve状态。在这种情况下，`timeout()`函数是这个值的生产者，所以它创建了`Deferred`对象还返回了`Promise`对象。通过这样，我能确保这个函数的调用者（消费者）不能够resolve或者reject这个`Deferred`对象。事实上，这个调用者只能添加函数去执行，和使用`done()`,`faile()`等方法。

## jQuery 1.x/2.x 与 jQuery 3的区别
在第一个例子里，我们创建了一段代码去查找一个名为"README.md"的文件，但是我们没有处理这个文件没有被找到的情况。这种情况应该被称作失败的情况，当失败发送时，我们可能需要去打断这个队列直接结束。如果这样做的话它会很自然的抛出一个异常，取到这个异常后被fail()这个方法执行，就像你在js里面用的catch()方法一样。

遵循Promises/A和Promises/A+的库（比如jQuery3.x），抛出的异常是被转换为rejection然后调用错误回调函数，比如`fail()`，被捕获的异常会作为参数传递进去。

在jQuery1.x和2.x版本中，未被捕获的异常会终止程序的执行，这些版本下允许抛出的异常冒泡，通常是达到`window.onerror`。如果没有定义函数去处理这个异常，这个异常信息会在控制台显示，而且会中断代码执行。

为了更好的理解他们不同的地方，让我们看看这个例子：
```javascript
var deferred = $.Deferred();
deferred
  .then(function() {
    throw new Error('An error message');
  })
  .then(
    function() {
      console.log('First success function');
    },
    function() {
      console.log('First failure function');
    }
  )
  .then(
    function() {
      console.log('Second success function');
    },
    function() {
      console.log('Second failure function');
    }
  );

deferred.resolve();

```
在jQuery3.x版本中，会打印信息"First failure function"和"Second success function"到控制台。原因就和我上面说的一样，一个抛出的异常会被转变为`rejection`，然后错误处理函数会在这时候被调用。而且，一旦异常被管理到（在这个例子中传递给了第二个`then()`），接下来的成功回调函数会被调用（本例中的第三个`then()`）。

在jQuery1.x和2.x版本中，只有第一个函数（抛出异常的函数）会执行，然后你会看到在控制台输出了"Uncaught Error: An error message"。

__jQuery 1.x/2.x__
<iframe class="" id="" data-url="http://jsbin.com/nozege/embed?js,console" src="http://jsbin.com/nozege/embed?js,console" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 200px;"></iframe>
__jQuery3__
<iframe class="" id="" data-url="http://jsbin.com/kifazi/embed?js,console" src="http://jsbin.com/kifazi/embed?js,console" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 200px;"></iframe>

为了进一步提高它与ECMAScript 2015的兼容性，jQuery3也给`Deferred`和`Promise`对象添加了一个`catch()`方法。它是被定义来处理`Deferred`对象`rejected`或者 它的`Promise`对象处于rejected的情况：
```javascript
deferred.catch(rejectedCallback)
```
这个方法只是`then(null,rejectedCallback)`的简写形式。

## 总结
在这篇文章里，我向你介绍了jQuery对于promises的实现方式。Promises让你不用很麻烦地让异步函数并行起来，也不用在回调函数里嵌套回调函数再嵌套回调函数……

除此之外，我也介绍了jQuery3怎么提升它和原生promise的兼容性。尽管老版本的jQuery和ECMAScript 2015的还有比较明显的不同，`Deferred`对象仍然是一个令人难以置信的强大的工具。作为一个专业的开发者，随着项目难度的增加，你会发现你会经常用到它。
