title: 垂直居中布局的几种css实现方法
tags: css学习心得
---

在开发中经常会需要实现一些居中布局问题，今天来总结一下垂直、水平居中布局的css实现方法。
<!-- more -->
### 任意高度的垂直居中布局

#### 1.父元素tabel-cell +vertical-align
此方法的优点：兼容性好，兼容ie8+。

    <style type="text/css">
        .parent{
            <!-- 样式内容省略 -->
            display: tabel-cell;
            vertical-align:middle;
        }
        .child{
            <!-- 样式内容省略 -->
        }
    </style>
    <div class="parent">
        <div class="child">DEMO</div>
    </div>
<textarea id="runCode1" name="textarea" rows="10" cols="60" class="runCode"><style type="text/css">.parent{height: 600px;width: 200px;background-color: #999;display: table-cell;vertical-align:middle;}.child{background-color:#aaa;width:100%;}</style><div class="parent"><div class="child">DEMO</div></div></textarea>
<input style="cursor: hand" onclick="runEx('runCode1')" type="button" value="运行代码" class="runCode-btn"/><br/>

#### 2. absolute + transform
优点：不会干扰其他元素  
缺点：兼容性不好

    <style>
        .parent{
            <!-- 样式内容省略 -->
            position:relative;
        }
        .child{
            <!-- 样式内容省略 -->
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            
        }
    </style>
    <div class="parent">
        <div class="child">DEMO</div>
    </div>
<textarea id="runCode2" name="textarea" rows="10" cols="60" class="runCode"><style type="text/css">.parent{height: 600px;width: 200px;background-color: #999;position:relative;}.child{background-color:#aaa;width:100%;line-height:100px;position: absolute;top: 50%;transform: translateY(-50%);}</style><div class="parent"><div class="child">DEMO</div></div></textarea>
<input style="cursor: hand" onclick="runEx('runCode2')" type="button" value="运行代码" class="runCode-btn"/><br/>

#### 3.flex+align-items
优点：和第一种方法一样只需要对父元素设置 
缺点：兼容性不好

    <style type="text/css">
        .parent{
            <!-- 样式内容省略 -->
            display: flex;
            align-items:center;
        }
        .child{
            <!-- 样式内容省略 -->
        }
    </style>
    <div class="parent">
        <div class="child">DEMO</div>
    </div>
<textarea id="runCode3" name="textarea" rows="10" cols="60" class="runCode"><style type="text/css">.parent{height: 600px;width: 200px;background-color: #999;display: flex;align-items:center;}.child{background-color:#aaa;width:100%;}</style><div class="parent"><div class="child">DEMO</div></div></textarea>
<input style="cursor: hand" onclick="runEx('runCode3')" type="button" value="运行代码" class="runCode-btn"/><br/>

### 固定高度的垂直居中布局
这个用以上的方法也可以，不过我比较喜欢用负margin实现

    <style>
        .parent{
            <!-- 样式内容省略 -->
            position:relative;
        }
        .child{
            <!-- 部分样式内容省略 -->
            height:200px;
            position: absolute;
            top: 50%;
            margin-top:-100px;
        }
    </style>
    <div class="parent">
        <div class="child">DEMO</div>
    </div>
<textarea id="runCode4" name="textarea" rows="10" cols="60" class="runCode"><style type="text/css">.parent{height: 600px;width: 200px;background-color: #999;position:relative;}.child{background-color:#aaa;width:100%;height:200px;position: absolute;top: 50%; margin-top:-100px;}</style><div class="parent"><div class="child">DEMO</div></div></textarea>
<input style="cursor: hand" onclick="runEx('runCode4')" type="button" value="运行代码" class="runCode-btn"/><br/>

总结了几种方法，各有利弊，还是那句话：具体情况具体分析~ 

ps:增加了运行代码的功能 更好的代码功能还在研究当中。