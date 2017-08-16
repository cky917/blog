title: postMessage解决跨域、跨窗口消息传递
tags: Javascript学习笔记
---
最近遇到一个需求，页面嵌入了iframe框，iframe框里是一个Im在线聊天对话框。在用户切换聊天对象时，外层页面也需要获取当前用户正在聊天的对方的userid。但是由于im页面是嵌入的iframe，外层父页面既无法监听切换聊天对象的事件，也无法获取里面的dom元素，会报跨域的错误。为了解决这一问题，可以使用html5的API`postMessage`.

<!-- MORE -->

## postMessage简单介绍
`postMessage()`方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

`postMessage(data,origin)`方法接受两个参数

 1.data:要传递的数据，html5规范中提到该参数可以是JavaScript的任意基本类型或可复制的对象，然而并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以我们在传递参数的时候需要使用JSON.stringify()方法对对象参数序列化，在低版本IE中引用json2.js可以实现类似效果。

2.origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然如果愿意也可以建参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。

## 子页面和父页面互相发送消息
为了兼容IE和非IE的事件绑定，下面的例子直接用了jQuery监听事件，如果用原生js，注意`function(e)`中的`e`没有包装在`e.originalEvent`，需要根据实际情况获取。

```
//在im页面，监听切换用户事件，然后给别人发送对方的用户id。
$('#im').on('click','.person-item',function(){
    var data = {key:'getUserId',val:'18'};
    window.parent.postMessage(JSON.stringify(data),'https://coolmogu.com');
})
//监听来自父页面的回执
$(window).on('message',function(e){
    var original = e.originalEvent;
    if(original.source != window.parent) return;
    console.log('父窗口说他收到了');
});
```
```
//在父页面，监听事件，
$(window).on('message',function(e){
    var original = e.originalEvent;
    var data = JSON.parse(original.data);
    if(original.origin != 'https://im.com' ||  data.key != 'getUserId'){
        return false;
    }
    console.log('当前im对话的对象是' + data.val);
    //父页面给iframe页面发送消息
    window.frames[0].postMessage('我收到了','http://im.com');
});
```
