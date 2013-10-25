/**
 * @file 工具
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

    var exports = {};

    /**
     * 样式补充
     * @type {Object}
     */
    var styleNameFix = {
            transition: '-webkit-transition'
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
            var fixName = styleNameFix[key];
            if (fixName) {
                css.push(fixName + ':' + value);
            }
            css.push(key + ':' + value);
        });

        ele.style.cssText += ';' + css.join(';');

        if (forceRefresh && ele.offsetWidth) {}
    };

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

        var finished = false;
        var handler = function (e) {
            if (finished) {
                return;
            }
            callback.call(ele, e);
            events.forEach(function (name) {
                ele.removeEventListener(name, handler, false);
            });
            finished = true;
        };

        events.forEach(function (name) {
            ele.addEventListener(name, handler, false);
        });
    };

    return exports;
});
