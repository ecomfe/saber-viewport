/**
 * @file 页面对象
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var Resolver = require('saber-promise');
    var Emitter = require('saber-emitter');

    var ATTR_PREFX = 'data-viewport';
    var ATTR_BAR = ATTR_PREFX + '-bar';
    var ATTR_FIXED = ATTR_PREFX + '-fixed';

    /**
     * 销毁
     *
     * @inner
     */
    function dispose(page) {
        // 删除主元素
        if (page.main && page.main.parentNode) {
            page.main.parentNode.removeChild(page.main);
        }
        page.main = null;

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
        
        var elements = dom.queryAll('[' + ATTR_BAR + ']', main);
        var bars = {};

        elements.forEach(function (ele) {
            bars[ele.getAttribute(ATTR_BAR)] = ele;
        });

        return bars;
    };

    /**
     * 获取页面中的fixed元素
     *
     * @public
     * @return {Array.<HTMLElement>}
     */
    Page.prototype.getFixed = function () {
        var main = this.main;

        return dom.queryAll('[' + ATTR_FIXED + ']', main);
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
     * @return {Promise}
     */
    Page.prototype.enter = function (transition, options) {
        // 如果当前页面已经移除
        // 不再进行转场操作
        if (!this.main) {
            return Resolver.rejected();
        }

        return this.viewport.transition(this, transition, options);
    };

    /**
     * 页面移除
     *
     * @public
     */
    Page.prototype.remove = function () {
        if (!this.cached) {
            dispose(this);
        }
        else if (this.main && this.main.parentNode) {
            this.main.parentNode.removeChild(this.main);
        }
    };

    return Page;
});
