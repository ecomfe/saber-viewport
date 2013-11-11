/**
 * @file 页面对象
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var bind = require('saber-lang/bind');

    /**
     * 渲染页面 
     * 获取相应的页面元素
     *
     * @inner
     * @param {Page} page
     */
    function render(page) {
        var main = page.main;
        
        var elements = dom.queryAll('[data-viewport-bar]', main);
        var bars = {};

        elements.forEach(function (ele) {
            bars[ele.getAttribute('data-viewport-bar')] = ele;
        });

        page.bars = bars;
    }

    /**
     * 页面类
     *
     * @constructor
     */
    function Page(url, viewport) {
        this.url = url;
        this.events = {};
        this.viewport = viewport;
        this.main = document.createElement('div');
    }

    /**
     * 注册事件
     *
     * @public
     * @param {string} eventname 事件名
     * @param {Function} callback 事件处理函数
     */
    Page.prototype.on = function (eventName, callback) {
        var events = this.events[eventName];

        if (!events) {
            events = this.events[eventName] = [];
        }

        events.push(callback);
    };

    /**
     * 触发事件
     *
     * @public
     * @param {string} eventname 事件名
     * @param {...*} 事件参数
     */
    Page.prototype.fire = function (eventName) {
        var args = Array.prototype.slice.call(arguments, 1);
        var events = this.events[eventName] || [];

        var me = this;
        events.forEach(function (item) {
            item.apply(me, args);
        });
    };

    /**
     * 以指定的转场方式进入页面
     *
     * @public
     * @param {string} transition 转场方式
     * @param {Object} options 转场配置参数
     */
    Page.prototype.enter = function (transition, options) {
        if (!this.main) {
            return;
        }

        render(this);

        this.fire('enter');
        this.viewport.transition(this, transition, options)
            .then(bind(this.fire, this, 'afterenter'));
    };

    /**
     * 页面移除
     *
     * @public
     */
    Page.prototype.leave = function () {
        this.fire('leave');
        
        // 删除bar元素
        if (this.bars) {
            var me = this;
            Object.keys(this.bars).forEach(function (key) {
                var ele = me.bars[key];
                if (ele.parentNode) {
                    ele.parentNode.removeChild(ele);
                }
            });
            this.bars = null;
        }

        // 删除主元素
        if (this.main && this.main.parentNode) {
            this.main.parentNode.removeChild(this.main);
            this.main = null;
        }

        this.viewport = null;
        this.fire('afterleave');
    };

    return Page;

});
