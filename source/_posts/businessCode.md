title: 如何写好前端业务代码
date: 2017-10-17 21:25:00
tags: 体会感悟
---
## 一、背景

想想从15年11月到现在，从zbj以前的交易取经团，到现在的顾问平台，大大小小做了不少业务需求，也是一边踩坑（一边挖坑）一边成长。以前维护10年累计下来的老代码，缝缝补补，主站所有项目全部在一个文件夹里，也是练就了一身从定位代码的本事。到后来新项目用了新框架，node作为controller层，后台不需要兼容ie的项目也引入了vue。刚开始的时候开心得不行，终于不用苦逼地搭php那一套老开发环境，前后端彻底分离，也不用维护那些“陈年佳酿”。后来才慢慢发现，其实并不是那么轻松。java写的服务化接口，基本是原子性的接口，一个接口只做一件事，所以前端除了完成以前的工作外，node端必须去处理之前几乎没有涉及到的业务逻辑，也承担了更重要的责任。经过了一年左右，几个项目的摸索，我也总结出了一些业务经验。

## 二、排期

这是很重要却最容易被忽略的一个环节。项目做到后面做得很累，感觉自己怎么也完不成，往往是因为排期没有做好。 

### 需求分析,功能模块细分

一个需求我们拿到的时候，肯定是先做需求分析。排期也是在完成需求分析的基础上进行的，需求分析的时候需要注意以下几点。

#### 明确需求

根据产品原型和产品的需求宣讲，梳理一遍需求，如果有自己不懂或者不理解的地方一定要在这个阶段产品明确。

#### 模块、功能划分

单页面排期一般就是从上到下按照功能不同分模块，比如顶部导航、信息展示、评价列表等等。

一般一个多页面的项目，产品们会在产品原型上根据他们的理解，分几个板块。但是我们分析需求的时候不能用他们的思路去分版块，而是要从开发和程序设计的角度去划分。比如在首页、某某搜索结果页、某某页有三个不同的地方，虽然样式不同、逻辑不完全相同，但是他们都在某步骤上涉及同一个业务逻辑。比如点击某个地方，判断用户在线，不在线调出登录框，在线的话创建订单，然后跳转支付页面。balabala，这个逻辑是不是最好让同一个人去完成，而且最好写成一个统一的接口或者组件呢。

### 依赖关系整理，时间线整理

划分好模块后，就是进行工期预估了。这也是一项很重要的工作，不仅是让团队的开发、测试、上线计划能够顺利开展，而且也能帮我们进行前期工作优先级安排。

需要依赖的东西包括设计稿、后端接口、其他前端组件、人员到位时间等等，排期时间需要根据这些依赖项产出的时间进行时间线的整理。

### 风险点预测

容易产生风险的点需要提出来，排期中留出适当的缓和时间。当然在开发中遇到阻碍也要及时抛出，让PMO或者项目负责人及时跟进解决。

### 每天跟进或者总结

根据排期最好做一个任务清单，每天总结完成的项目，想好明天的开发计划。

## 如何面对快速的业务需求迭代

最近做的一个项目是一个从0开始的新项目，产品发展方向其实也不是非常明确，需要上线试错，经过用户反馈和数据收集后不断改进。一期产品为了快速上线往往很多需求做了简化，这时候如果在一期的开发上不注重项目的扩展性，后面的每一次迭代都是伤筋动骨。

### 功能细分、代码模块化

尽量让功能变成积木一样的，每个部分写成一个模块，方便后期维护和拓展。代码模块化，一个几千行的文件，几百行的方法真的难以维护，其实就是一句话，当你觉得这部分代码好长，那就是需要拆分模块了。

### 通用接口多样化

这也算是我挖的一个坑。在一期的时候，有一个搜索接口，当时的需求只需要通过一个id进行查询，我设计的接口参数就是传一个id。当1.2.4的迭代版本的时候，产品说需要支持多个id查询，java把参数改成了数组类型。我准备改的时候，发现已经有几个其他业务方调用我这个接口，传的是单个id，我为了不去改更多地方，只能在接口层面做了单个和多个的兼容。

所以在接口设计的时候，就要尽可能考虑多种调用场景，可拓展地设计接口入参和出参。

### 公用逻辑提取

之前也提到了，在一期的时候可能我们并没有发现这个逻辑其他地方也可能会用，所以写到了自己的模块文件里。当后面业务发展，这个逻辑其他业务方也要接入，而且仅仅是来复制粘贴你的代码的时候，就应该要马上做出判断，这部分逻辑是否需要提成一个公用接口，如果是包含了前端各种逻辑比如弹窗、调用其他前端组件等，这个逻辑就要提成一个组件。
一是减少了后续的开发成本和维护成本，二是让这部分逻辑更加可控。保证后续修改逻辑的时候，没有遗漏到某个地方。除了保证组件的一致性，可拓展性也很重要，对于组件的设计，又是另外一个话题了。

### 内容配置化，业务逻辑不要写死

除了产品提出需求要开发配置功能外，我们自己也要主动去拆分可配置的内容。
一些业务上经常改动的部分，需要产品和运营去修改的部分，比如推荐位id列表，推荐位图片等，走cms配置。
一些静态数据，不经常改但是可能改动，比如网址等可以写到配置中心或者配置文件。
如果实在没必要走配置的，也要写成一个常量，这就让我想起了以前接的一个需求，把某某发布最低金额限制的判断从`3000`改到`1000`，我在老代码里`ctrl+f`了很多地方，才把那些`3000`全部改成一个统一的常量。

静态内容和代码分离是最好的，内容改动，仅仅改一下配置就行，不需要走上线流程，这样才能真正做到以不变应万变。

### 其他

还有其他需要注意的点，我也就不一一说明了。

- 发现不对劲，一定要停下来和产品沟通。
- 任何显示给用户的字符串，都应该抽取成常量，方便国际化，这点也是我做了一个项目转国际化的需求得出的感想。但是在后续开发中其实还是没有实施，如果项目有国际化的需求，需要考虑这一点。

## 三、业务安全问题

因为做了Node层，很多参数校验都是我们做了，也就积累了一些和业务安全相关的经验（安全测试环节被查水表）。这里提到的就不仅仅是xss和csrf了，更多的是业务层面的安全问题

- xss
- csrf
- 表单提交的内容，如果网站有这个需求，需要做违规违法字过滤
- 推送红包、站内信、通知、发布订单、发送手机验证码等http接口，需要做防刷处理，限制次数
- 用户id用token加密解密获取，而不是直接用cookie里的userid
- 注意判断用户的身份和权限，防止越权


## 四、定位问题

1. 尽量在所有可能出错的地方，捕获并抛出问题，报错内容清晰指明什么接口报错，方便定位。比如一大堆的报错都是`'系统异常！'`和`创建支付订单失败：xxxx`，哪个更容易定位错误呢？
2. 方法文档清晰。
3. 使用charles、findler等工具调试非本地环境代码

暂时想到了这些，如果后续还有新的体会会来补充。