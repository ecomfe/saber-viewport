/**
 * @file 工具
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');

    var exports = {};

    /**
     * 设置元素样式
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Object} propertys 样式
     * @param {boolean} forceRefresh 是否强制刷新
     */
    exports.setStyles = function (ele, propertys, forceRefresh) {
        Object.keys(propertys).forEach(function (name) {
            dom.setStyle(ele, name, propertys[name]);
        });
        if (forceRefresh && ele.offsetWidth) {}
    };

    return exports;
});
