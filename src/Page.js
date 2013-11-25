/**
 * @file 页面对象
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var curry = require('saber-lang/curry');
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
     * 入场结束后处理
     *
     * @inner
     */
    function finishTransition(page) {
        // 缓存的页面在转场结束后需要回复滚动位置
        if (page.cached) {
            var ele = page.viewport;
            var status = page.status || {};
            ele.scrollLeft = status.scrollLeft || 0;
            ele.scrollTop = status.scrollTop || 0;
        }
        page.emit('afterenter');
    }

    /**
     * 出场前处理
     *
     * @inner
     */
    function beforeleaveHandler(page) {
        if (page.cached) {
            var ele = page.viewport;
            var status = page.status || {};
            status.scrollLeft = ele.scrollLeft;
            status.scrollTop = ele.scrollTop;
            page.status = status;
        }
    }

    /**
     * 销毁
     *
     * @inner
     */
    function dispose(page) {
        if (page.bars) {
            Object.keys(page.bars).forEach(function (key) {
                var ele = page.bars[key];
                if (ele.parentNode) {
                    ele.parentNode.removeChild(ele);
                }
            });
            page.bars = null;
        }

        // 删除主元素
        if (page.main) {
            if (page.main.parentNode) {
                page.main.parentNode.removeChild(page.main);
            }
            page.main = null;
        }

        page.viewport = null;
    }

    /**
     * 页面类
     *
     * @constructor
     */
    function Page(url, viewport, options) {
        options = options || {};
        Emitter.mixin(this);
        this.url = url;
        this.viewport = viewport;
        this.cached = options.cached;
        this.main = options.main || document.createElement('div');

        this.on('beforeleave', curry(beforeleaveHandler, this));
    }

    Page.prototype.clone = function (options) {
        var res = new Page(
                this.url, 
                this.viewport, 
                { 
                    cached: options.cached,
                    main: this.main
                }
            );

        return res;
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

        if (!this.bars) {
            render(this);
        }

        this.emit('enter');
        this.viewport.transition(this, transition, options)
            .then(curry(finishTransition, this));
    };

    /**
     * 页面移除
     *
     * @public
     */
    Page.prototype.leave = function () {
        this.emit('leave');

        if (!this.cached) {
            dispose(this);
        }
        else if (this.main && this.main.parentNode) {
            this.main.parentNode.removeChild(this.main);
        }
        
        this.emit('afterleave');
    };

    return Page;
});
