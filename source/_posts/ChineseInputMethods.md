title: js中文输入法字符串截断问题解决
date: 2016-01-27 14:06:50
tags: Javascript学习笔记

---
最近遇到了一个需求：一个输入框最大输入字数为7个字，用户输入超出7个字时，显示警告提示，并且阻止用户输入。

用input propertychange事件可以监听到用户的输入，在英文或者数字输入状态是没有问题的。但是在中文输入法输入情况下，不同浏览器有不同的表现。有的浏览器会在输入拼音时就会进入判断，如果拼音就已经超过7个字符，就不能再继续输入。
如下：
```html
<input id="test"/><span class="warn">不能输入超过7个字</span>
    <script type="text/javascript">
        var test = $('#test');
        test.on('input propertychange', function() {
            var value = $(this).val();
            console.log('当前输入：'+value);
            if(value.length>7){
                $(this).val(value.substring(0,7));
                $('.warn').show()
            }else{
                $('.warn').hide();
            }
        })
    </script>
```
<textarea id="runCode1" name="textarea" rows="10" cols="60" class="runCode"><script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.1/jquery.min.js"></script><style type="text/css">.warn{display: none;color: #f00;}</style><body><input id="test"/><span class="warn">不能输入超过7个字</span>
    <script type="text/javascript">var test = $('#test');test.on('input propertychange', function(){var value = $(this).val();console.log('当前输入：'+value);if(value.length>7){$(this).val(value.substring(0,7));$('.warn').show()}else{$('.warn').hide();}})</script><body></textarea>

<input style="cursor: hand" onclick="runEx('runCode1')" type="button" value="运行代码" class="runCode-btn"/><br/>

运行以上代码可以发现，比如我想输入“报价方案”时，如果打全拼根本无法打出来就被阻止了。在网上找了解决方案之后，发现了一些以前没听过的事件。

>#### 复合事件
复合事件（composition event）是DOM3级事件中新添加的一类事件，用于处理IME的输入序列。IME（Input Method Editor，输入法编辑器）可以让用户输入在物理键盘上找不到的字符。复合事件就是针对检测和处理这种输入而设计的。
       （1）compositionstart：在IME的文本复合系统打开时触发，表示要开始输入了。
（2）compositionupdate：在向输入字段中插入新字符时触发。
（3）compositionend：在IME的文本复合系统关闭时触发，表示返回正常键盘的输入状态。

用这个事件，我们可以实现中文输入法截断的问题了。如下：

```html
    <input id="test"/><span class="warn">不能输入超过7个字</span>
    <script type="text/javascript">
        var test = $('#test');
        test.on('input propertychange change', function() {
            if($(this).prop('comStart')) return;    // 中文输入过程中不截断
            var value = $(this).val();
            console.log('当前输入：'+value);
            if(value.length>7){
                $(this).val(value.substring(0,7));
                $('.warn').show()
            }else{
                $('.warn').hide();
            }
        }).on('compositionstart', function(){
            $(this).prop('comStart', true);
            console.log('中文输入：开始');
        }).on('compositionend', function(){
            $(this).prop('comStart', false);
            console.log('中文输入：结束');
        });
    </script>
```
<textarea id="runCode2" name="textarea" rows="10" cols="60" class="runCode"><script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.1/jquery.min.js"></script><style type="text/css">.warn{display: none;color: #f00;}</style><body><input id="test"/><span class="warn">不能输入超过7个字</span><script type="text/javascript">var test = $('#test');test.on('input propertychange change', function(){if($(this).prop('comStart')) return;var value = $(this).val();console.log('当前输入：'+value);if(value.length>7){$(this).val(value.substring(0,7));$('.warn').show()}else{$('.warn').hide();}}).on('compositionstart', function(){$(this).prop('comStart', true);console.log('中文输入：开始');}).on('compositionend', function(){$(this).prop('comStart', false);console.log('中文输入：结束');});</script><body></textarea>

<input style="cursor: hand" onclick="runEx('runCode2')" type="button" value="运行代码" class="runCode-btn"/><br/>

![完美](http://i4.tietuku.com/e52018b653051022.jpg)

