/**
 * @file 弹出转场
 * @author Firede(firede@firede.us)
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var extend = require('saber-lang/extend');
    var curry = require('saber-lang/curry');
    var runner = require('saber-run');
    var dom = require('saber-dom');
    var util = require('../util');
    var config = require('../config');

    /**
     * 弹出方向
     *
     * @const
     */
    var DIRECTION = {
        FORWARD: 'forward',
        BACKWARD: 'backward'
    };

    /**
     * 转场前准备
     *
     * @inner
     */
    function prepare(frontPage, backPage, options) {
        var viewport = config.viewport;
        var frontEle = frontPage.main;
        var backEle = backPage.main;

        // 添加父容器，使前后页面层次得以显现
        var container = document.createElement('div');
        var width = frontEle.offsetWidth + 'px';

        container.appendChild(frontEle);
        container.appendChild(backEle);

        // 初始化容器样式
        util.setStyles(
            container,
            {
                position: 'relative',
                width: width,
                height: options.height,
                overflow: 'hidden'
            }
        );

        // 页面基础样式
        var baseStyles = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        // 向定义页面样式
        var frontStyles;
        var backStyles;

        if (options.direction === DIRECTION.FORWARD) {
            frontStyles = {
                transform: 'scale3d(1, 1, 1)',
                opacity: 1,
                'z-index': 1
            };

            backStyles = {
                transform: 'scale3d(0, 0, 1)',
                opacity: 0,
                'z-index': 0
            };
        }
        else {
            frontStyles = {
                transform: 'scale3d(1, 1, 1)',
                opacity: 1,
                'z-index': 0
            };

            backStyles = {
                transform: 'scale3d(2, 2, 1)',
                opacity: 0,
                'z-index': 1
            };
        }

        // 初始化页面样式
        util.setStyles(
            frontEle,
            extend(frontStyles, baseStyles)
        );

        util.setStyles(
            backEle,
            extend(backStyles, baseStyles)
        );

        viewport.appendChild(container);

        // 强制更新 DOM
        container.offsetWidth;

        return container;
    }

    /**
     * 转场过程
     *
     * @inner
     * @return {Promise}
     */
    function running(frontPage, backPage, options) {
        var frontPageEle = frontPage.main;
        var backPageEle = backPage.main;

        var runningFrontPage = runner.transition(
            frontPageEle,
            {
                opacity: 0,
                transform: options.direction === DIRECTION.FORWARD ? 'scale3d(2, 2, 1)' : 'scale3d(0, 0, 1)'
            },
            {
                duration: options.duration,
                timing: options.frontTiming
            }
        );

        var runningBackPage = runner.transition(
            backPageEle,
            {
                opacity: 1,
                transform: 'scale3d(1, 1, 1)'
            },
            {
                duration: options.duration,
                timing: options.backTiming,
                delay: options.gap
            }
        );

        return Resolver.all([runningFrontPage, runningBackPage]);
    }

    /**
     * 转场结束
     *
     * @inner
     */
    function finish(frontPage, backPage, container, resolver) {
        console.log('run finish()');
        var viewport = config.viewport;
        var backEle = backPage.main;

        // 还原设置的样式
        util.setStyles(backEle, {
            position: 'static',
            top: '',
            right: '',
            bottom: '',
            left: '',
            transform: '',
            opacity: '',
            'z-index': ''
        });

        // 调整 DOM 结构
        viewport.appendChild(backEle);
        // frontPage 已经从 DOM 树中移除 transitionEnd 事件无法执行
        // 需要手动清除动画效果
        util.setStyles(frontPage.main, {'transition': ''});
        viewport.removeChild(container);

        resolver.fulfill();
    }

    /**
     * 弹出转场
     *
     * @param {Resolver} resolver Resolver 对象
     * @param {Object} options 转场参数
     * @param {Page} options.frontPage 转场前页（转出页）
     * @param {Page} options.backPage 转场后页（转入页）
     * @param {number} options.duration 动画时间 秒为单位
     * @param {string} options.frontTiming 前页过渡速度曲线
     * @param {string} options.backTiming 后页过渡速度曲线
     * @param {string} options.height viewport 的设计高度（带单位）
     * @param {number} options.gap 转场前后页动画开始时间的间隔
     */
     function popup(resolver, options) {
        var backPage = options.backPage;
        var frontPage = options.frontPage;

        // 参数初始化
        options.duration = options.duration || config.duration;
        options.frontTiming = options.frontTiming || 'out';
        options.backTiming = options.backTiming || 'in';
        // 想取得最佳效果，需设置 height 选项
        options.height = options.height || document.documentElement.clientHeight + 'px';
        options.gap = options.gap || options.duration / 3;

        // 转场方向设置
        options.direction = options.direction || (backPage.hasVisited ? DIRECTION.BACKWARD : DIRECTION.FORWARD);

        // 准备并获取页面容器
        var container = prepare(frontPage, backPage, options);

        // 开始转场动画
        running(frontPage, backPage, options)
            .then(curry(finish, frontPage, backPage, container, resolver));
    }

    require('../transition').register('popup', popup);

    // 暴露弹出方向常量
    popup.FORWARD = DIRECTION.FORWARD;
    popup.BACKWARD = DIRECTION.BACKWARD;

    return popup;

});
