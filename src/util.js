/**
 * @file 工具
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

    var exports = {};

    /**
     * 样式前置
     * @type {Object}
     */
    var styleNamePrefix = {
            transition: ['-webkit-'],
            transform: ['-webkit-', '-ms-'],
            'transition-property': ['-webkit-', '-ms-'],
            'transition-duration': ['-webkit-', '-ms-'],
            'transition-timing-function': ['-webkit-', '-ms-'],
            'transition-delay': ['-webkit-', '-ms-']
        };

    /**
     * 格式化样式名为多单词链接形式
     *
     * @inner
     * @param {string} name
     * @return {string}
     */
    function formatStyleName(name) {
        return name.replace(/[A-Z]/g, function ($0) {
            return '-' + $0;
        });
    }

    /**
     * 设置元素样式
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Object} propertys 样式
     * @param {boolean} forceRefresh 是否强制刷新
     */
    exports.setStyles = function (ele, propertys, forceRefresh) {
        var css = [];

        var value;
        Object.keys(propertys).forEach(function (key) {
            value = propertys[key];
            key = formatStyleName(key);
            var prefixes = styleNamePrefix[key] || [];
            prefixes.forEach(function (prefix) {
                css.push(prefix + key + ':' + value);
            });
            css.push(key + ':' + value);
        });

        ele.style.cssText += ';' + css.join(';');

        if (forceRefresh && ele.offsetWidth) {}
    };

    /**
     * 事件补充
     * @type {Object}
     */
    var eventFix = {
        'transitionend': [
            'transitionend', 'webkitTransitionEnd', 
            'oTransitionEnd', 'MSTransitionEnd'
         ]
    };

    /**
     * 注册一次事件
     */
    exports.one = function (ele, eventName, callback) {
        var events = eventFix[eventName] || [eventName];

        // 防止事件响应重复
        var called = false;
        var handler = function (e) {
            if (!called) {
                callback.call(ele, e);
                called = true;
            }
            events.forEach(function (name) {
                ele.removeEventListener(name, handler, false);
            });
        };

        events.forEach(function (name) {
            ele.addEventListener(name, handler, false);
        });
    };

    return exports;
});
