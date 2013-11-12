/**
 * @file 页面对象
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var bind = require('saber-lang/bind');
    var Emitter = require('saber-emitter');

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
        Emitter.mixin(this);
        this.url = url;
        this.events = {};
        this.viewport = viewport;
        this.main = document.createElement('div');
    }

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

        this.emit('enter');
        this.viewport.transition(this, transition, options)
            .then(bind(this.emit, this, 'afterenter'));
    };

    /**
     * 页面移除
     *
     * @public
     */
    Page.prototype.leave = function () {
        this.emit('leave');
        
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
        this.emit('afterleave');
    };

    return Page;

});
