title: 函数防抖和节流
date: 2017-04-27 14:06:50
tags: web前端知识
---

### 函数防抖
我们经常会遇到这样的需求：需要我们监听用户的输入向后端发送请求，比如搜索推荐，我们会监听input框的change事件，但是如果用户每次按下键盘都发送请求，会发送很多请求、卡顿等。为了优化这种情况，我们就需要用到函数防抖。

>函数防抖就是让某个函数在上一次执行后，满足等待某个时间内不再触发此函数后再执行，而在这个等待时间内再次触发此函数，等待时间会重新计算。

使用函数防抖后，假设我们input框的change事件，当输入完成后300ms我们才向服务端发送请求，如果在300ms内，用户又开始输入了，那我们就重新计时等待300ms。直到用户停止输入，300ms内都没有再次输入，我们就发出请求。这样就可以让用户真的输入完毕后才开始使用用户输入的信息，而不是在打每一个字母的时候。

我们先看下underscore.js里相关函数的定义：

```javascript
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_.debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  var later = function() {
    var last = _.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function() {
    context = this;
    args = arguments;
    timestamp = _.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};
```
参数function是需要进行函数防抖的函数；参数wait则是需要等待的时间，单位为毫秒；immediate参数如果为true，则debounce函数会在调用时立刻执行一次function，而不需要等到wait这个时间后，例如防止点击提交按钮时的多次点击就可以使用这个参数。

可以从下面我写的例子里看到2者的区别，明显看出使用了防抖的明显避免了没必要的多次请求。
<a class="jsbin-embed" href="http://jsbin.com/fuxowejolo/1/embed?js,output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.41.6"></script>

### 函数节流
还有一些需求，在滚动页面的时候监听滚动的位置做出相应的交互，比如本站文章页右侧的目录导航滚动。所以我们需要监听页面的滚动事件，在滚动事件监听的回调里执行你的方法。如果用户滚动很快，一秒内可能执行上百次，导致页面性能变得很慢。
但是这次的情况跟上面的有所不同，我们不是要在每完成等待某个时间后去执行某函数，而是要每间隔某个时间去执行某函数，避免函数的过多执行，这个方式就叫函数节流。

我们还是来看一下underscore.js里相关函数的定义：

```javascript
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.

_.throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
```
参数function是需要进行函数节流的函数；参数wait则是函数执行的时间间隔，单位是毫秒。option有两个选项，throttle第一次调用时默认会立刻执行一次function，如果传入{leading: false}，则第一次调用时不执行function。{trailing: false}参数则表示禁止最后那一次延迟的调用。
进行滚动2个DIV内部，可以看到函数节流的效果，明显看出，快速滚动，函数节流的情况下减少了多次回调的调用。
<a class="jsbin-embed" href="http://jsbin.com/havuximowu/1/embed?js,output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.41.6"></script>

