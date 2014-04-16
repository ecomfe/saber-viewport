/**
 * @file 转场效果
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');
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
     * @param {string|boolean=} type 转场类型
     * @param {Object} options 转场参数
     */
    function transition(type, options) {
        var resolver = new Resolver();
        
        // 不进行转场动画
        if (config.transition === false
            || type === false
        ) {
            if (options.frontPage) {
                options.frontPage.emit('beforeleave');
            }
            config.viewport.appendChild(options.backPage.main);
            resolver.fulfill();
            return resolver.promise();
        }

        var handler = handlers[type || config.transition];

        if (!handler) {
            throw new Error('can not find transition');
        }

        // 如果没有前景页面 
        // 直接显示待转场页面
        if (!options.frontPage) {
            config.viewport.appendChild(options.backPage.main);
            resolver.fulfill();
        }
        else {
            options.frontPage.emit('beforeleave');
            handler(resolver, options);
        }
        return resolver.promise();
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
