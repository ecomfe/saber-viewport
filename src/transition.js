/**
 * @file 转场效果
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var config = require('./config');

    /**
     * 转场处理器
     * 
     * @type {Object}
     */
    var handlers = {};

    /**
     * 页面转场
     *
     * @public
     * @param {string} type 页面转场
     * @param {Object} options 转场参数
     */
    function transition(type, options) {
        var handler = handlers[options.transition];

        if (!handler) {
            throw new Error('can not find transition');
        }

        // 如果没有前景页面 
        // 直接显示待转场页面
        if (!options.frontPage) {
            config.viewport.appendChild(options.backPage.main);
        }
        else {
            handler(options);
        }
    }

    /**
     * 注册转场处理器
     *
     * @public
     * @param {string} type 转场类型
     * @param {Function} handler 处理函数
     */
    transition.register = function (type, handler) {
        handlers[type] = handler;
    };

    return transition;
});
