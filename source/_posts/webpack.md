title: webpack学习笔记
tags: web前端知识
---
webpack学习笔记
<!-- more -->
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