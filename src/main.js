/**
 * @file 视口管理 页面换场、scroll等功能
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var extend = require('saber-lang/extend');
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
     * url访问记录
     *
     * @type {Array.<string>}
     */
    var accessPath = [];

    /**
     * 缓存的Page
     *
     * @type {Object}
     */
    var cachedPage = {};

    /**
     * 检查url是否访问过
     *
     * @inner
     * @param {string} url
     * @param {boolean}
     */
    function checkUrl(url) {
        var index = accessPath.indexOf(url);
        
        return index >= 0 && index < accessPath.length - 1;
    }

    /**
     * 记录访问的页面
     *
     * @inner
     * @param {Page} page
     */
    function visited(page) {
        var url = page.url;
        var index = accessPath.indexOf(url);

        if (index >= 0) {
            accessPath.splice(index);
        }

        accessPath.push(url);

        if (frontPage) {
            frontPage.leave();
        }
        
        backPage = null;
        frontPage = page;
    }

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
     * @param {string=} type 转场类型
     * @param {object=} options 转场参数
     * @return {Promise}
     */
    controller.transition = function (page, type, options) {
        if (config.loading) {
            loading.hide();
        }

        // 添加滚动中CSS样式
        config.viewport.className += ' transiting'

        options = options || {};
        options.frontPage = frontPage;
        options.backPage = page;
        return transition(type, options).then(function () {
            var clsName = config.viewport.className;
            // 让渲染引擎先完成工作再移除样式
            // 虽然`saber-promise`默认触发`then`是使用`setTimeout`
            // 但是遇到浏览器支持`MutationObserver`的时候就呵呵了(iOS6+, android4.4+是支持的)
            // 所以这里还是手动`setTimeout`保证下
            setTimeout(function () {
                config.viewport.className = clsName.replace(/\s+transiting(\s|$)/, function ($0, $1) {
                    return $1;
                });
            }, 0);
        });
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

            // 在完成显示后记录当前显示的页面
            page.on('afterenter', function () {
                visited(this);
            });

            page.hasVisited = checkUrl(url);
            
            // 如果存在待转场页面则先移除
            if (backPage) {
                backPage.leave();
            }

            if (config.loading) {
                loading.show(config.loading);
            }

            return backPage = page;
        }
    };
});
