title: Less is more
date: 2015-11-09 10:17:50
tags: css学习心得
---

工作中为了模块化，我们会采用less进行开发。所以充分了解less的使用方法可以使开发变得更加有效率。
<!-- more -->

>LESS是一种动态样式语言，属于CSS预处理语言的一种，它使用类似CSS的语法，为CSS的赋予了动态语言的特性，如变量、继承、运算、函数等，更方便CSS的编写和维护。

>LESS可以在多种语言、环境中使用，包括浏览器端、桌面客户端、服务端。

下面介绍一下less的用法（更详细内容见[官方文档](http://www.1024i.com/demo/less/document.html)）：

#### 一、LESS注释：
1. /\* 注释内容 \*/ 

这种注释方法编译后，注释内容会保留到css文件内容中。

2. //注释内容 
这种注释方法编译后，注释内容不会保留到css文件中。

#### 二、变量：
我们可以像js一样为css定义变量并重复使用它。
语法：@变量名:值;
LESS源码：

    @color: #4D926F;

    #header {
        color: @color;
    }
    h2 {
        color: @color;
    }
编译后的css:

    #header {
        color: #4D926F;
    }
    h2 {
        color: #4D926F;
    }

#### 三、混合
混合可以将一个定义好的class A轻松的引入到另一个class B中，从而简单实现class B继承class A中的所有属性。我们还可以**带参数**地调用，就像使用函数一样。

LESS源码：

    .rounded-corners (@radius: 5px) {//带了默认值，如果调用时未传参数，则默认此值
        -webkit-border-radius: @radius;
        -moz-border-radius: @radius;
        -ms-border-radius: @radius;
        -o-border-radius: @radius;
        border-radius: @radius;
    }

    #header {
        .rounded-corners;
    }
    #footer {
        .rounded-corners(10px);//传了参数 改变了@radius的值
    }

编译后的CSS：

    #header {
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
        border-radius: 5px;
    }
    #footer {
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -ms-border-radius: 10px;
        -o-border-radius: 10px;
        border-radius: 10px;
    }

#### 嵌套
我们可以在一个选择器中嵌套另一个选择器来实现继承，这样很大程度减少了代码量，并且代码看起来更加的清晰。

LESS源码：

    #header {
        h1 {
            font-size: 26px;
            font-weight: bold;
        }
        p {
            font-size: 12px;
            a {
                text-decoration: none;
                &:hover {
                    border-width: 1px
                }
            }
        }
    }

编译后的CSS：

    #header h1 {
        font-size: 26px;
        font-weight: bold;
    }
    #header p {
        font-size: 12px;
    }
    #header p a {
        text-decoration: none;
    }
    #header p a:hover {
        border-width: 1px;
    }

但是我更建议定义类名来调用，不建议用标签或者多层嵌套。