# upstream
> JavaScript请求服务负载均衡，仿nginx upstream

### 说明
- 根据配置的源发起`fetch` 返回`ok=true`表示可用
- 源须支持跨域请求
-  **3** 秒超时， **10** 秒请求缓存，缓存全局对象`upstreamCache`

### 作用
- 无缝切换可用的源
- 优先选择最快的源

### 使用
- <https://www.netnr.com/run/code/4890439129232505252>
```
var hosts = ["lib.baomitu.com", "unpkg.com"];

//所有源请求完或默认超时
upstream(hosts, function (fast, ok) {
    //fast:最快的源
    //ok:可用的源 数组
    console.log(fast, ok)
});

//最快的一个源或默认超时
upstream(hosts, function (fast, ok) {
    console.log(fast, ok)
}, 1);

//所有源请求完或自定义超时
upstream(hosts, function (fast, ok) {
    console.log(fast, ok)
}, 280);


//主机头跳转或404等，须请求具体路径的情况
upstream([
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
    "https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"
], function (fast, ok) {
    console.log(fast, ok);
    //根据ok变量提取可用的源
});


/*
 实战：使用跨域代理解决不能直接请求API的情况，且转换HTTP为HTTPS协议
 https://ss.netnr.com/weather
 一个天气接口，直接发起请求存在跨域的问题，而且是HTTP协议
 配置多个跨域服务的源，调用跨域服务得到API数据
*/
upstream(["https://proxy.zme.ink/", "https://bird.ioliu.cn/v2?url="], function (fast) {
    var api = "http://wthrcdn.etouch.cn/weather_mini?citykey=101040100";
    var url = fast + api;
    fetch(url).then(res => res.json()).then(data => console.log(data));
}, 1);
```