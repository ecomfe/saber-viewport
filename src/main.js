/**
 * @file 视口管理 页面换场、scroll等功能
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var extend = require('saber-lang/extend');
    var curry = require('saber-lang/curry');

    var config = require('./config');
    var Page = require('./Page');
    var transition = require('./transition');
    var loading = require('./loading');

    /**
     * 前景页面（当前呈现的页面）
     * @type {Page}
     */
    var frontPage;

    /**
     * 待转场页面
     * @type {Page}
     */
    var backPage;

    /**
     * 缓存的Page
     *
     * @type {Object}
     */
    var cachedPage = {};

    /**
     * 初始化视口
     *
     * @inner
     */
    function initViewport() {
        var viewport = config.viewport;

        viewport.style.position = 'relative';
    }

    /**
     * 初始化前景页面
     *
     * @inner
     */
    function initFrontPgae() {
        var viewport = config.viewport;
        var children = dom.children(viewport);

        if (children.length <= 0) {
            return;
        }

        var page = new Page('__blank__');
        children.forEach(function (item) {
            page.main.appendChild(item);
        });
        viewport.appendChild(page.main);

        frontPage = page;
    }

    /**
     * 转场开始前处理
     *
     * @inner
     * @param {Page} frontPage 前景页
     * @param {Page} backPage 后景页
     */
    function beforeTransition(front, back) {
        // 触发转场前事件
        if (front) {
            front.emit('beforeleave');
        }
        back.emit('beforeenter');
    }

    /**
     * 转场结束后处理
     *
     * @inner
     * @param {Page} frontPage 前景页
     * @param {Page} backPage 后景页
     */
    function afterTransition(front, back) {
        // 触发转场完成事件
        if (front) {
            front.emit('afterleave');
            front.remove();
        }
        back.emit('afterenter');

        // 切换前后场景页
        backPage = null;
        frontPage = back;
    }

    /**
     * 视图控制器
     *
     * @type {Object}
     */
    var controller = {};

    /**
     * 页面转场
     *
     * @protected
     * @param {Page} page 将要进行转场操作的页面
     * @param {string|boolean=} type 转场类型
     * @param {object=} options 转场参数
     * @param {Promise}
     */
    controller.transition = function (page, type, options) {
        // 转场页面不是当前后景页面
        // 则放弃转场
        if (page !== backPage) {
            return Resolver.rejected();
        }

        if (config.loading) {
            loading.hide();
        }

        options = options || {};
        options.frontPage = frontPage;
        options.backPage = page;

        beforeTransition(frontPage, page);

        return transition(type, options)
            .then(curry(afterTransition, frontPage, page));
    };

    return {
        /**
         * 初始化
         *
         * @public
         * @param {HTMLElement|string} ele
         * @param {Object} options 全局配置参数
         */
        init: function (ele, options) {
            if (typeof ele == 'string' || ele instanceof String) {
                ele = document.getElementById(ele);
            }
            config = extend(config, options);
            config.viewport = ele;

            initViewport();
            initFrontPgae();
        },

        /**
         * 加载url
         * 显示页面需要调用page.enter方法
         *
         * @public
         * @param {string} url
         * @param {Object} options 配置参数
         * @param {boolean} options.cached 是否缓存page
         * @return {Page} 页面对象
         */
        load: function (url, options) {
            var options = options || {};
            
            // 创建新页面
            var page;
            page = cachedPage[url];

            if (!page) {
                page = new Page(url, controller, options);
            }
            else {
                page = page.clone(options);
            }

            if (options.cached) {
                cachedPage[url] = page;
            }
            else if (cachedPage[url]) {
                delete cachedPage[url];
            }

            // 如果存在待转场页面则先移除
            if (backPage) {
                backPage.remove();
            }

            if (config.loading) {
                loading.show(config.loading);
            }

            return backPage = page;
        }
    };
});
