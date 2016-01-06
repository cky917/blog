title: node.js学习笔记(六)——文件操作
date: 2016-01-04 10:18:50
tags: node.js学习笔记
---
fs模块是文件操作的封装，它提供了文件的读取、写入、更名、删除、遍历目录、链接POSIX文件系统操作。与其他模块不同的是，*fs模块中的所有操作都提供了异步和同步两个版本，*例如读取文件内容函数的异步方法：readFile(),同步方法readFileSync()。
<!-- more -->
#### 一、`fs.readFile(filename,[encoding],[callback(err,data)])`是最简单的读取文件函数。
参数：
filename：读取的文件名。
encoding：文件的字符编码。 
callback 回调函数提供两个参数err和data，err表示有没有错误发生，data是文件内容。如果指定了encoding，data是一个解析后的字符串，否则将会以buffer形式表示的二进制数据。
例1：
```javascript
//异步读取文件
//file.txt内容为"哈哈哈"
var fs = require('fs');
fs.readFile('file.txt','utf-8',function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});
console.log('end');
```
执行结果：
```javascript
end
哈哈哈
```
#### 二、fs.readFileSync(filename,[encoding])
同步读取文件接受的参数和fs.readFile()相同，而读取到的文件内容会以函数返回值的形式返回，如果有错误发生，fs将抛出异常，你需要try和catch捕获并处理异常。
例2；
```javascript
//同步读取文件
var fs = require('fs');
try{
    var data = fs.readFileSync('file1.txt','utf-8');
    console.log(data);
    console.log('end');
}catch(e){
    console.log(e);
}

```
执行结果：
```javascript
哈哈哈
end
```
#### 三、fs.open(path,flags,[mode],[callback(err,fd)])
是POSIXopen函数的封装，与C语言标准库中的fopen函数类似，它接受两个必选参数。
path为文件路径，
flag可以为以下值：

| 值       | 作用           |
| ---------|-------------| 
| r  | 以只读模式打开文件 | 
| r+ | 以读写模式打开文件 |
| w  | 以写入模式打开文件，如果文件不存在则创建 |
| w+ | 以读写模式打开文件，如果文件不存在则创建 | 
| a  | 以追加模式打开文件，如果文件不存在则创建 |
| a+ | 以读取追加模式打开文件，如果文件不存在则创建 |

mode:用于创建文件时给文件指定权限，默认是0666，回调函数将会传递一个文件描述符fd。
0666:文件权限值POSIX系统中对文件读取和访问权限的范围，通常用八进制数表示。0754表示文件所有者权限是7（读、写、执行），同组用户权限是5（读、执行），其他用户的权限是4（读）。
fd:文件描述是一个非负整数，表示操作系统内核为当前进程所维护的打开文件的记录表索引。

#### 四、fs.read(fd,buffer,offset,length,position,[callback(err,bytesRead,buffer)])
是POSIX中read函数的封装，相比readFild()提供了更底层的接口，从指定的文件描述fd中读取数据并写入。
fd:指定的文件描述
buffer:指向的缓存区对象，
offset:是buffer的写入偏量值
length:读取的字节数
position:文件读取的起始数，如果为null，则从当前文件指针读取。
回调函数传递err,bytesRead和buffer，分别表示读取的字节数和缓冲区对象。
例：
```javascript
var fs = require('fs');
fs.open('file.txt','r',function(err,fd){
    if(err){
        console.log(err);
        return;
    }
    var buf = new Buffer(8);
    fs.read(fd,buf,0,8,null,function(err,bytesRead,buffer){
        if(err){
            console.log(err);
            return;
        }
        console.log('bytesRead '+bytesRead);
        console.log(buffer);
    });
});

```
执行结果：
```javascript
bytesRead 8
<Buffer e5 95 a6 e5 95 a6 e5 95>
```
更多内容请参考[api手册](http://nodeapi.ucdok.com/#/api/fs.html)