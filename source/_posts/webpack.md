title: webpack学习笔记
date: 2017-09-05 16:31:00
tags: web前端知识
---
webpack学习笔记
<!-- more -->

>[官方文档](https://doc.webpack-china.org/guides/getting-started/)

## webpack的特点

### 代码拆分

`Webpack` 有两种组织模块依赖的方式，同步和异步。异步依赖作为分割点，形成一个新的块。在优化了依赖树后，每一个异步区块都作为一个文件被打包。

### Loader

`Webpack` 本身只能处理原生的 `JavaScript` 模块，但是 `loader` 转换器可以将各种类型的资源转换成 `JavaScript` 模块。这样，任何资源都可以成为 `Webpack` 可以处理的模块。

### 智能解析

`Webpack` 有一个智能解析器，几乎可以处理任何第三方库，无论它们的模块形式是 `CommonJS`、 `AMD` 还是普通的 `JS` 文件。甚至在加载依赖的时候，允许使用动态表达式 `require("./templates/" + name + ".jade")`。

### 插件系统

`Webpack` 还有一个功能丰富的插件系统。大多数内容功能都是基于这个插件系统运行的，还可以开发和使用开源的 Webpack 插件，来满足各式各样的需求。

### 快速运行

`Webpack` 使用异步 `I/O` 和多级缓存提高运行效率，这使得 `Webpack` 能够以令人难以置信的速度快速增量编译。


## 配置：
```
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //入口文件
    // entry: './src/script/main.js',
    // entry:["./src/script/main.js","./src/script/a.js"],//把2个文件打包在一起
    entry:{
        main:'./src/script/main.js',
        a:"./src/script/a.js"
    },
    //输出
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name]-[chunkhash].js',
        publicPath: 'http://cdn.com' //编译的文件域名
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                'style-loader',
                'css-loader'
                ]
            }
        ]
    },
    //source-map 仅开发环境使用
    devtool: 'inline-source-map',
    plugins:[
        //https://www.npmjs.com/package/html-webpack-plugin
        new htmlWebpackPlugin({
            filename:'index.html',
            template: 'index.html',
            inject:'body', //script标签放的位置
            title:'webpack is index',
            minify: {
                removeComments:true,//删除注释
                collapseWhitespace:true
            },
            // chunks: ['main','a'] //指定当前html包含的chunk
            excludeChunks:['a']//指定排除的chunk
        }),
        new htmlWebpackPlugin({
            filename:'a.html',
            template: 'index.html',
            inject:'body', //script标签放的位置
            title:'webpack is a',
            minify: {
                removeComments:true,//删除注释
                collapseWhitespace:true
            },
            // chunks: ['a'] //指定当前html包含的chunk
            excludeChunks:['main']//指定排除的chunk
        }),
    ]
};
```