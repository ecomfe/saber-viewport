/**
 * @file 页面对象
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var curry = require('saber-lang/curry');
    var Emitter = require('saber-emitter');

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
    }

    /**
     * 获取页面中的bar
     *
     * @public
     * @return {Object}
     */
    Page.prototype.getBar = function () {
        var main = this.main;
        
        var elements = dom.queryAll('[data-viewport-bar]', main);
        var bars = {};

        elements.forEach(function (ele) {
            bars[ele.getAttribute('data-viewport-bar')] = ele;
        });

        return bars;
    };

    /**
     * 克隆
     *
     * @public
     * @param {Object} options
     * @return {Page}
     */
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
     * @param {string|boolean=} transition 转场方式
     * @param {Object} options 转场配置参数
     */
    Page.prototype.enter = function (transition, options) {
        if (!this.main) {
            return;
        }

        this.viewport.transition(this, transition, options);
    };

    /**
     * 页面移除
     *
     * @public
     */
    Page.prototype.dipose = function () {
        if (!this.cached) {
            dispose(this);
        }
        else if (this.main && this.main.parentNode) {
            this.main.parentNode.removeChild(this.main);
        }
    };

    return Page;
});
