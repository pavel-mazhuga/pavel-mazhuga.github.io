window.loadedScripts = [];

module.exports = function loadScript(url, success, fail) {
    if (url in window.loadedScripts) {
        if (window.loadedScripts[url]) {
            return typeof success !== 'undefined' && success();
        }
        return typeof fail !== 'undefined' && fail();
    }

    const script = document.createElement('script');

    script.onerror = () => {
        window.loadedScripts[url] = false;
        return typeof fail !== 'undefined' && fail();
    };

    script.onload = () => {
        window.loadedScripts[url] = true;
        return typeof success !== 'undefined' && success();
    };

    script.async = true;
    script.type = 'text/javascript';
    script.src = url;

    const head = typeof document.head !== 'undefined' ? document.head : document.getElementsByTagName('head')[0];
    head.appendChild(script);

    return script;
};
