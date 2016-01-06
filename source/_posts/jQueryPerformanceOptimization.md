title: jQuery性能优化
date: 2015-11-25 10:17:50
tags: Javascript学习笔记
---
jQuery已经成为前端开发中重要的类库之一，也是前端开发er的一个利器，了解到如何正确使用jQuery达到最佳性能是一个很重要的事。下面从各个方面来总结一下jQuery性能优化技巧和注意事项。
<!-- more -->
### 一、使用合适的选择器
**$('#id')**
使用id来定位DOM元素无疑是提高性能的最佳方式，因为这会直接调用本地方法`document.getElementById()`。
如果这样找不到所需要的元素，可以使用find()方法。`$("#content").find("div");`为了提高性能，建议从最近的id元素开始往下搜索。

**$('p'),$('div'),$('input')**
标签选择器也不错，因为jQuery是直接调用本地方法`document.getElementsByTagName()`。

**$('.class')**
对于比较新的浏览器，它支持本地方法`document.getElementsByClassName()`。但是对于ie8及以下版本浏览器，只能通过DOM搜索的方法来实现，这无疑会带来一些性能的影响。建议有选择地使用。

**$("[attribute=value]")**
对于利用属性来定位DOM元素，本地javascript并没有方法直接实现，大多是使用DOM搜索的方式来达到效果。很多现代浏览器支持querySelectAll()方法，但是不同浏览器的性能还是有区别。总体来说，使用这种方式性能不是非常理想，所以为了获得更好的优化效果，建议尽量避免这种对性能有害的方式。

**$(":hidden")**
和上面利用属性定位DOM元素一样，这种伪选择器也同样没有直接在本地javascript方法中实现，并且jQuery需要搜索每一个元素来定位这个选择器，这将对性能带来比较大的影响，所以建议尽量不要使用。如果非要使用，请先使用ID选择器定位父元素然后再使用该选择器，这样对性能优化有帮助。

- **尽量使用ID选择器**
- **尽量给选择器指定上下文**

### 二、缓存对象
其实这是javascript也需要注意的地方
```javascript
//bad
$("#light").bind('click',function(){...});
$("#light").css('border',"1px solid red");
$("#light").fadeIn("slow");

//good
var light = $("#light");
light.bind('click',function(){...});
light.css('border',"1px solid red");
light.fadeIn("slow");
```
本例中用链式方式将更加简洁，上面只是为了说明缓存变量的重要性。
```javascript
//链式
var light = $("#light");
light.bind('click',function(){...})
    .css('border',"1px solid red")
    .fadeIn("slow");
```
如果打算在其他函数中使用jQuery对象，那么可以把它们缓存到全局环境中。如下代码所示：
```javascript
window.$my = {
    head : $('head'),
    light: $('#light'),
    light_button: $("#light_button")
};
function dosomething(){
    //现在可以引用存储结构并操作它们
    var script = docuement.creatElement("script");
    $my.head.append(script);
    // 当你在函数内部操作时，可以继续将查询存入全局对象中去
    $my.cool_results = $("#some_ul li");
    $my.other_results = $("#some");
    // 全局函数作为一个普通的jquery对象去使用
    $my.other_results.css("border-color","red");
}
```
记住，永远不要让相同的选择器在你的代码里出现多次。

### 三、事件代理
每一个JavaScript事件（例如click、mouseover等）都会冒泡到父级节点。当我们需要给多个元素调用同个函数时，这点会很好用。比如,我们要为一个表格绑定这样的行为：点击td后，把背景色设置为红色，代码如下：
```javascript
//bad
$("#mytable td").click(functuon(){
   $(this).css('background','red');
});
```
假如有100个td元素，在使用以上方式时，绑定了100个事件，这将带来很负面的性能影响。
```javascript
//good
$("#mytable").click(function(e){
    var $clicked = $(e.target);//e.target 捕捉到触发的目标元素
    $clicked.css('background','red');
});
```
在这种方式中，只为一个元素绑定了事件，明显优于之前那种。
在jQuery 1.7中，提供了新的方式on()来帮助我们将整个事件监听封装到一个便利的方法中。
```javascript
//good
$("#mytable").on('click','td',function(e){
    $(this).css('background','red');
});
```

### 四、将你的代码转换为jQuery插件
如果每次都需要用一定的时间去开发类似的代码，那么可以考虑将代码变成插件。它能够使你的代码有更好的重用性，并且能够有效组织代码。创建插件的代码如下：
```javascript
(function($){
    $.fn.pulgName = function(){
        //code
        return this;
    }
})(jQuery)
```
### 五、合理利用HTML的data属性
HTML5的data属性可以帮助我们插入数据，特别是前后端的数据交换。jQuery的data()方法可以自动得到数据。例子：
```html
<div id="d1" data-role="page" data-last-value="43" data-options='{"name":"John"}'></div>
```
读取数据：
```javascript
$("#d1").data("role");  //page
$("#d1").data("last-value");  //43
$("#d1").data("options").name;  //John
```

*——总结来自《锋利的jQuery》*