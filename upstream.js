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
        //10���ڻ���
        var startTime = new Date().valueOf(), cacheKey = hosts.join(','),
            hostsCache = window.upstreamCache[cacheKey];
        if (hostsCache && startTime - hostsCache.date < 10000) {
            callback(hostsCache.ok[0], hostsCache.ok);
        } else {
            var ok = [], bad = 0, i = 0, len = hosts.length;
            for (; i < len;) {
                var host = hosts[i++];
                //�Զ���������
                host = host.trim().toLowerCase().indexOf("//") >= 0 ? host : "//" + host;
                //����fetch����ӳɹ���url����url��hosts���ܲ�һ��������֧�ֿ�������
                fetch(host).then(res => res.ok && ok.push(res.url)).catch(() => bad++)
            }
            var si = setInterval(function () {
                var isc = false, now = new Date().valueOf();
                //��timeoutΪ1�����������õ�host
                if (timeout == 1 && ok.length > 0) {
                    isc = true;
                }
                //����������� �� ��ʱ��Ĭ��3000���룩�����ؽ��
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