title: JavaScript实践
tag: Javascript学习笔记
---
---
### 命名

代码是给人(别人或者1个星期后的 自己)阅读和修改的 

給变量和函数一个简单易懂的名字 

可维护性++

** 以功能命名,而不是表现  isOverSeven() × VS isLegalAge() √ **

    // 不好的命名
    aaaa  
    x1  
    f  
    hengxian  
    createNewUserIfTheInputIsValida
    te
   避免全局变量

> 我们无法拥有代码的控制权

* 不易维护 
* 牵一发而动全身 
* 易被覆盖,修改,而你还不知道


     // Bad
    var currentColor;
    var colorMap = {
        red: '红色',
        green: '绿色',
        yellow: '黄色'
    };
    
    function init() {
        currentColor = 'red';
    }
        

    // Common
    (function () {
        var currentColor;
        
        var colorMap = {
            red: '红色',
            green: '绿色',
            yellow: '黄色'
        };
        
        function init () {
            currentColor = 'red';
        }
    })();
    
    // Good
    var colorManager = function () {  
    var currentColor;  
    var colorMap  =  {           
        red: '红色',           
        green: '绿色',           
        yellow: '黄色' 
    };  

        return  { 
            init: function () {                   
                currentColor  =  'red'          
            } 
        } 
    }();
    
---
### 正确的注释

注释也是代码的一部分 

错误的注释,相比没有注释,更可怕 

介绍背景、介绍使用方式、介绍注意事项,不要重复代码的意思

    //  已登陆的用户,有  name  和  age  两个属性  
    var loginedUser = {           
        name:  '',           
        age:  10  
    };
    /*  
        *  统一登录方法  
        *  在需要登录的地方调用       
        *  如果已经登陆,会立即执行回调       
        *  否则,会显示登录窗口,登录完成后执行回 调  
        *  todo:登录窗口的  UI  优化  
    */  
    function login(cb) {  
    }

---
### 简短标记

简短标记让代码更简单易读

    // Bad
    var user = new Object;
    user.name = 'bajiefe';
    user.age = 20;
    
    // Good
    var user = {
        name: 'bajiefe',
        age: 20
    };
    
    // Bad
    var userList = new Array;
    userList[0] = 'bajiefe';
    userList[1] = 'bajierd';
    
    // Good
    var userList = ['bajiefe', 'bajierd'];
    
    
    // Bad
    var age;
    if(val) {
        age = val;
    } else {
        age = 10;
    }
    
    // Good
    var age = val || 10;
    
    
    // Bad
    var direction;
    
    if(val) {
        direction = 1;
    } else {
        direction = -1;
    }
    
    // Good
    var direction = val ? 1 : -1;
---
### 减少DOM 操作

通过 className 来控制 DOM 样式

    // Bad
    userInput.style.cssText = 'color: red; border: 1px  solid  red;'  
    
    // Good
    userInput.className  =  ‘error;’

dom 节点修改好后再插入 dom  tree
    
    // Bad
    function addAnchor(parentElement, anchorText, anchorClass) {
        var element = document.createElement('a');
        parentElement.appendChild(element);
        element.innerHTML = anchorText;
        element.className = anchorClass;
    }
    
    // Good
    var element = document.createElement('a');
    element.innerHTML = anchorText;
    element.className = anchorClass;
    parentElement.appendChild(element);

通过文档片段创建 DOM
    
    document.createDocumentFragment();
    
    function addAnchors(element) {
        var anchor;
        var fragment = document.createDocumentFragment();
    
        for(var i = 0; i < 10; i++) {
            anchor = document.createElement('a');
            anchor.innerHTML = 'test';
            fragment.appendChild(anchor);
        }
    
        element.appendChild(fragment);
    }

通过事件代理绑定事件

---
### 自动分号插入

当不清楚写不写分号时,写上

    var tester = function() {
    
    }
    
    (function() {
        console.log(tester);
    })()
    
    var a = 123

---
### Debug
Google 开发者工具