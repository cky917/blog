title: 好玩的cookie
date: 2015-08-18 10:17:50
tags: Javascript学习笔记

---
最近接触了cookie，发现浏览器cookie真的挺好玩的，前端做的事也可以在网页关闭或刷新后依然存在，多难得啊（被用户清除了cookie就没办法了...）。cookie可以帮助前端实现一些用户行为储存，进而实现一些针对用户的操作。

cookie的增删查改也并不难，但是有一些细节还是得注意。

***cookie的设置/修改封装函数***

1. 直接也可以设置:`document.cookie= 'name=value'`;
2. 更推荐封装函数：
		// 设置expires
		// var date=new Date(); 
    	// var expiresDays=10; 
    	// 将date设置为10天以后的时间 
    	// date.setTime(date.getTime()+expiresDays*24*3600*1000); 
		function setCookie(name,value,expires,path,domain,secure){
			var cookie = encodeURIComponent(name) + '=' +encodeURIComponent(value);
			if(expires){
				cookie += ';expires=' + expires.toGMTString();//失效时间
			}
			if(path){
				cookie += ';path=' +path;
			}
			if(domain){
				cookie +=';secure' + secure;//http协议时生效，默认false
			}
			document.cookie = cookie;
			
			//用法：set("loginSuc","yes",date,path,domain,secure)
		}
		

***cookie的获取封装函数***
		
		String.prototype.trim=function(){//去除字符串两端空格
     		return this.replace(/(^\s*)|(\s*$)/g, ”); 
			}
		function getcookie(Name) {
   			var cookie = {};
    		var all = document.cookie;
   	 		if (all === '')
       			return cookie;
    		var list = all.split('; ');
    		for (var i = 0; i < list.length; i++) {
        		var item = list[i];
        		var p = item.indexOf('=');
        		var name = item.substring(0, p);
        		name = decodeURIComponent(name).trim();//注意这里有个坑，除了第一个name，后面的name前面都有一个空格，所以要处理掉前面的空格才行；
       			var value = item.substring(p + 1);
        		value = decodeURIComponent(value);
        		cookie[name] = value;
    		}
    		return cookie[Name];
		}
	//用法：getCookie("loginSuc");
	
***cookie的删除函数封装***

	function removeCookie(name) { 
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() - 1); 
	    var cval=getCookie(name); 
	    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
	} 
	

使用cookie我们可以设置用户的登录状态，亦或是点击了不再显示后就设置一个不再显示的cookie,通过获取cookie来达到效果。感觉棒棒哒！