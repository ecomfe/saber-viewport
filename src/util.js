/**
 * @file 工具
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var curry = require('saber-lang/curry');

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
     * TODO: it's not a good idea
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Object} 样式
     * @return {Function(Object)} 链式调用，多次设置，会在之前样式应用后再设置
     */
    exports.setStyles = function (ele, propertys) {
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

        var setter = function (propertys) {
            setTimeout(
                curry(exports.setStyles, ele, propertys),
                0
            );
            return {
                set: setter
            };
        };

        return {
            set: setter
        };
    };

    return exports;
});
