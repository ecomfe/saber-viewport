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
     * TODO: scroll设置
     *
     * @inner
     */
    function initViewport() {
        var viewport = config.viewport;

        viewport.style.overflow = 'hidden';
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
        options = options || {};
        options.frontPage = frontPage;
        options.backPage = page;
        return transition(type, options);
    };

    return {
        /**
         * 初始化
         *
         * @public
         * @param {HTMLElement} ele
         * @param {Object} options 全局配置参数
         */
        init: function (ele, options) {
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
         * @return {Page} 页面对象
         */
        load: function (url) {
            // 创建新页面
            var page = new Page(url, controller);
            page.hasVisited = checkUrl(url);
            // 在完成显示后记录当前显示的页面
            page.on('afterenter', function () {
                visited(this);
            });
            
            // 如果存在待转场页面则先移除
            if (backPage) {
                backPage.leave();
            }

            return backPage = page;
        }
    };
});
