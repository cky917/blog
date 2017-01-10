title: 单元测试 & mocha框架
date: 2016-01-06 12：08
tags: 
- node.js学习笔记 
- web前端知识
---
## 一、什么是单元测试

>单元测试（unit testing），是指对软件中的最小可测试单元进行检查和验证。对于单元测试中单元的含义，一般来说，要根据实际情况去判定其具体含义，如C语言中单元指一个函数，Java里单元指一个类，图形化的软件中可以指一个窗口或一个菜单等。总的来说，单元就是人为规定的最小的被测功能模块。单元测试是在软件开发过程中要进行的最低级别的测试活动，软件的独立单元将在与程序的其他部分相隔离的情况下进行测试。

单元测试在前端领域并不被重视，前端程序员也没有写单元测试的习惯。但是，随着前端技术的发展，随着node的发展，越来越多“非UI”的前端代码出现，前端开发们也需要了解掌握单元测试知识。
单元测试是保证代码质量的重要环节之一，特别是这些代码是会提供给其他人使用的时候，比如node插件，grunt插件等等
单元测试的作用有许多，下面列举一些：
- 保证代码可用
- 另一种纬度的文档
- 方便迭代回归
- 驱动开发

### TDD与BDD
__TDD__,全称是Test Driver Development，测试驱动开发。先编写测试用例（没有代码之前这些测试用例一个也通不过），然后再写代码让这些测试用例通过。更进一层的讲就是：编写足够的测试用例使测试失败，编写足够的代码是测试成功。我们编码的目的更加明确的。
__TDD的优点__：
1. 站在用户的角度思考，从用户的角度尽可能地想会进行的操作，而不是从一个开发的角度。
2. 先编写测试用例，再进行开发，为开发进行指导性的参考，防止遗漏某些功能。
3. 首先由了一套完整的测试用例，便可以让代码重构更安全，因为重构只是改变内部结构，不应改变外部功能，而TDD是关注外部接口，所以在重构时，只要保证测试用例通过即可放心更改内部代码。
4. 如果更改了某部分代码使测试用例不通过了，我们可以马上定位到刚才写的代码，修改错误。

TDD把工作量前置，前期的准备工作量较大，不过后期就会很轻松。
关于TDD的介绍，可以看看这篇文章：[学习TDD：TDD的好处](http://blog.csdn.net/m13666368773/article/details/7006912)

__BDD__,全称是Behavior Driven Development，行为驱动开发。相比于TDD，BDD更加侧重设计，其要求在设计测试用例的时候对系统进行定义，倡导使用通用的语言将系统的行为描述出来，将系统设计和测试用例结合起来，从而以此为驱动进行开发工作。
BDD的通用语言是一种近乎自然语言的描述软件的形式。传统的开发模式中，开发人员很难从业务需求考虑问题，基于这种通用语言形式可以尽可能避免了因为理解需求不充分而带来的不必要的工作量。
BDD描述的行为就像一个个的故事(Story)，需求方、开发者、测试人员一起合作，分析软件的需求，然后将这些需求写成一个个的故事。开发者负责填充这些故事的内容，测试者负责检验这些故事的结果。

## 二、mocha
[Mocha](https://mochajs.org/)是具有丰富特性的 JavaScript 测试框架，可以运行在 Node.js 和浏览器中，使得异步测试更简单更有趣。Mocha 可以持续运行测试，支持灵活又准确的报告，当映射到未捕获异常时转到正确的测试示例。
它支持TDD/BDD等多种流行的接口，也接受多种Assertions（断言），如should.js/expect/chai/better-assert（断言框架）等，通过这些即可构建各种风格的测试用例。

### 安装
要开始我们的单元测试之路，首先要安装mocha。
```javascript
npm install mocha --save
```
为了方便，我们选择了断言库，这里选择的是[chai](http://chaijs.com/)。chai是一个断言库，node本身也有个断言模块，但是功能比较弱，语法也比较贫乏。 
chai提供了三种断言风格来分别适用于BDD和TDD。__expect/should__ API 对应BDD风格__，__Assert__ API 对应TDD风格。
```javascript
npm install chai --save
```
### 起步
修改package.json 配置：
```javascript
 .....
"scripts": {
    "test": "mocha"
  },
  .....
```
mocha默认执行test文件夹下的文件，所以一般测试文件都放在/test文件夹下面。并且命名为xxx.test.js
/api/add.js
```javascript
function add(x,y){
    return x + y;
}
module.exports = add;
```
/api/checkUser.js
```javascript
function checkUser(userName){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            if(userName == 'cky'){
                resolve({data:true});
            }else{
                resolve({data:false});
            }
        },300);
    });
}
module.exports = checkUser;
```
/test/add.test.js

```javascript
var mocha  = require('mocha');
var chai   = require("chai");
var expect = chai.expect;
var add    = require('../api/add');
describe('api文件测试', function() {
  describe('add()函数测试', function() {
    it('1+2应该等于3', function() {
      expect(add(1,2)).to.be.equal(3);
    });
  });
});
```
/test/userCheck.test.js

```javascript
var mocha     = require('mocha');
var chai      = require("chai");
var expect    = chai.expect;
var checkUser = require('../api/checkUser');
describe('api文件测试', function() {
  describe('checkUser()异步函数测试', function() {
    it('cky返回true', function() {
      return checkUser('cky').then(function(rs){
        expect(rs.data).to.be.ok;
      });
    });
    it('xxx返回false', function() {
      return checkUser('xxx').then(function(rs){
        expect(rs.data).to.be.not.ok;
      });
    });
  });
});
```

执行结果：
```powershell
▶ npm test
> mochatest@0.0.1 test /Users/chenkeyi/cky/myDemo/test
> mocha
  api文件测试
    add()函数测试
      ✓ 1+1应该等于2
    checkUser()异步函数测试
      ✓ cky返回true (304ms)
      ✓ xxx返回false (303ms)
  3 passing (627ms)
```

上面这段代码，就是测试脚本，它可以独立执行。测试脚本里面应该包括一个或多个describe块，每个describe块应该包括一个或多个it块。
describe块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称（"api文件测试"），第二个参数是一个实际执行的函数。
it块称为"测试用例"（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称（"1+2应该等于3"），第二个参数是一个实际执行的函数。

从`checkUser`方法测试也可以看出，是支持promise风格写法的。

### 断言

所谓"断言"，就是判断源码的实际执行结果与预期结果是否一致，如果不一致就抛出一个错误。所有的测试用例（it块）都应该含有一句或多句的断言。它是编写测试用例的关键。断言功能由断言库来实现，Mocha本身不带断言库，所以必须先引入断言库。

上面也提到了断言库chai，其中有三个API expect/should/assert，
详细的文档可以查看[chai](http://chaijs.com/api/)，暂时不详细说了。

### 命令行参数
`--recursive` 执行/test文件夹下的所有测试文件
`--reporter,-R` 参数用来指定测试报告的格式，默认是spec格式
`--watch,-w` 参数用来监视指定的测试脚本。只要测试脚本有变化，就会自动运行Mocha。
`--bail,-b` 参数指定只要有一个测试用例没有通过，就停止执行后面的测试用例。这对持续集成很有用。
`--grep,-g` 参数用于搜索测试用例的名称（即it块的第一个参数），然后只执行匹配的测试用例。
`--invert,-i` 参数表示只运行不符合条件的测试脚本，必须与--grep参数配合使用。

这些命令行参数可以写在mocha.opts文件中配置，这样命令行输入`mocha`一个命令就可以了
```javascript
//mocha.opts
--reporter tap
--recursive
--growl
```

如果不是在test文件夹下存放测试文件，可以在mocha.opts配置文件中配置
```javascript
//指定运行server-tests文件夹下的文件
server-tests
--recursive
```

### 异步测试
Mocha默认每个测试用例最多执行2000毫秒，如果到时没有得到结果，就报错。对于涉及异步操作的测试用例，这个时间往往是不够的，需要用-t或--timeout参数指定超时门槛。
```javascript
//timeout.js
var mocha     = require('mocha');
var chai      = require("chai");
var expect    = chai.expect;
var checkUser = require('../api/checkUser');
describe('api文件测试', function() {
  describe('timeout超时测试', function() {
    it('测试应该4000毫秒后结束', function(done) {
      var x = true;
      var f = function() {
        x = false;
        expect(x).to.be.not.ok;
        done(); // 通知Mocha测试结束
      };
      setTimeout(f, 4000);
    });
  });
});
```
在不设置 -t时，执行报错
```javascript
1) api文件测试 timeout超时测试 测试应该5000毫秒后结束:
     Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.
```
设置超时5000m`mocha -t 5000`后正常执行

另外，上面的测试用例里面，有一个done函数。it块执行的时候，传入一个done参数，当测试结束的时候，必须显式调用这个函数，告诉Mocha测试结束了。否则，Mocha就无法知道，测试是否结束，会一直等到超时报错。

另外，Mocha内置对Promise的支持，允许直接返回Promise，等到它的状态改变，再执行断言，而不用显式调用done，见/test/userCheck.test.js。

### 测试用例的钩子

Mocha在describe块之中，提供测试用例的四个钩子：`before()`、`after()`、`beforeEach()`和`afterEach()`。它们会在指定时间执行。
```javascript
describe('hooks', function() {
  before(function() {
    // 在本区块的所有测试用例之前执行
  });
  after(function() {
    // 在本区块的所有测试用例之后执行
  });
  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
  });
  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });
  // test cases
});
```



### 参考文档 
- [测试框架 Mocha 实例教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
- [单元测试 & mocha 简述](http://imweb.io/topic/5634c91109e01a534b461eaa?utm_source=tuicool&utm_medium=referral)
- [学习TDD：TDD的好处](http://blog.csdn.net/m13666368773/article/details/7006912)