title: 用js原生实现Ajax的get和post
date: 2015-08-18 10:17:50
tags: Javascript学习笔记

---

虽然jquery的ajax挺方便，但是了解了原生实现的原理也是很不错的。而且封装好的原生Js Ajax用起来也挺方便的~ XD~


#### 参数序列化函数

	function serialize (data) {//将参数序列化
    	if (!data) return '';
    	var pairs = [];
    	for (var name in data){
        	if (!data.hasOwnerProperty(name)) continue;
        	if (typeof data[name] === 'function') continue;
       		var value = data[name].toString();
       		name = uncodeURIComponent(name);
        	value = uncodeURIComponent(value);
        	pairs.push(name + '=' + value);
    	}
    	return pairs.join('&');
	}

#### 原生封装Ajax的get方法

	function get(url,options,callback){
    	var xhr = new XMLHttpRequest();
    	xhr.onreadystatechange = function (){
       		if (xhr.readyState == 4) {
            	if ((xhr.status > 200 && xhr.status < 300) || xhr.status == 304) {
               		callback(xhr.responseText);
            }else {
                alert("request failed : " + xhr.status);
            }
        };
    }
    xhr.open("get",url + "?" + serialize(options),true);
    xhr.send(null);//get 不将数据作为参数传入
    }
		
***调用方式***：

	get(url,json,function(data){
		console.log('data');
		//如果data为json对象，需要JSON.parse(data)解析之后才可以用
	})


#### 原生封装Ajax的post方法
		
		function post(url, options, callback) {
    		var xhr = new XMLHttpRequest();
    		xhr.onreadystatechange = function(callback) {
        	if(xhr.readyState == 4) {
           		if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                	callback(xhr.responseText);
           		}else {
               		alert('request failed!' + xhr.status);
            	}
       		}
    	}
    	xhr.open('post', url, true);
    	xhr.send(serialize(options));
    }
      
	//用法：getCookie("loginSuc");
	
