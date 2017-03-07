title: 函数防抖和节流
tags: web前端知识
---

### 函数防抖
我们经常会遇到这样的需求：需要我们监听用户的输入向后端发送请求，比如搜索推荐，我们会监听keypress事件，但是如果用户每次按下键盘都发送请求，也会发送很多请求。为了优化这种情况，我们就需要用到函数防抖。

>函数防抖就是让某个函数在上一次执行后，满足等待某个时间内不再触发此函数后再执行，而在这个等待时间内再次触发此函数，等待时间会重新计算。

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
### 函数节流
还有一些需求，在滚动页面的时候监听滚动的位置做出相应的交互，比如本站文章页右侧的目录导航滚动。所以我们需要监听页面的滚动事件，在滚动事件监听的回调里执行你的方法。如果用户滚动很快，一秒内可能执行上百次，导致页面性能变得很慢。