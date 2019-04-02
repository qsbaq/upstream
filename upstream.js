/*
    upstream: From nginx upstream
    - Source must support cross-domain
    v1.0.0
    2019-04-02
    https://github.com/netnr/upstream
 */
(function (window) {
    var ups = function (hosts, callback, timeout) {
        window.upstreamCache = window.upstreamCache || {};
        //10秒内缓存
        var startTime = new Date().valueOf(), cacheKey = hosts.join(','),
            hostsCache = window.upstreamCache[cacheKey];
        if (hostsCache && startTime - hostsCache.date < 10000) {
            callback(hostsCache.ok[0], hostsCache.ok);
        } else {
            var ok = [], bad = 0, i = 0, len = hosts.length;
            for (; i < len;) {
                var host = hosts[i++];
                //自动补齐链接
                host = host.trim().toLowerCase().indexOf("//") >= 0 ? host : "//" + host;
                //发起fetch，添加成功的url（该url与hosts可能不一样），须支持跨域请求
                fetch(host).then(res => res.ok && ok.push(res.url)).catch(() => bad++)
            }
            var si = setInterval(function () {
                var isc = false, now = new Date().valueOf();
                //当timeout为1，返回最快可用的host
                if (timeout == 1 && ok.length > 0) {
                    isc = true;
                }
                //所有请求结束 或 超时（默认3000毫秒），返回结果
                var istimeout = now - startTime > ((timeout == 1 || !timeout) ? 3000 : timeout);
                if (ok.length + bad == len || istimeout) {
                    isc = true;
                }
                if (isc) {
                    clearInterval(si);
                    window.upstreamCache[cacheKey] = { date: now, ok: ok };
                    callback(ok[0], ok);
                }
            }, 1)
        }
    }

    window.upstream = ups;

    return ups;
})(window);