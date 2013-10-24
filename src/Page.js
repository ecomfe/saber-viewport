/**
 * @file 页面对象
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

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

        this.fire('enter');
        var me = this;
        options = options ||{};
        options.callback = function () {
            me.fire('afterenter');
        };

        this.viewport.transition(this, transition, options);
    };

    /**
     * 页面移除
     *
     * @public
     */
    Page.prototype.leave = function () {
        this.fire('leave');
        if (this.main && this.main.parentNode) {
            this.main.parentNode.removeChild(this.main);
            this.main = null;
        }
        this.viewport = null;
        this.fire('afterleave');
    };

    return Page;

});
