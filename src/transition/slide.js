/**
 * @file 滑动转场
 * @authro treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var curry = require('saber-lang/curry');
    var util = require('../util');
    var config = require('../config');

    /**
     * 转场前准备
     * 添加包含元素，添加浮动等
     *
     * @inner
     */
    function prepare(frontPage, backPage) {
        var viewport = config.viewport;
        var frontEle = frontPage.main;
        var backEle = backPage.main;

        // 添加父容器，使前后页面能水平排布
        var container = document.createElement('div');
        var width = frontEle.offsetWidth;
        util.setStyles(container, {width: width * 2 + 'px'});
        container.appendChild(frontEle);
        if (backPage.hasVisited) {
            container.insertBefore(backEle, frontEle);
        }
        else {
            container.appendChild(backEle);
        }

        // 设置浮动
        util.setStyles(frontEle, {
            float: 'left',
            width: width + 'px'
        });
        util.setStyles(backEle, {
            float: 'left',
            width: width + 'px'
        });

        // 设置container的负magrinLeft
        // 用于左滑入
        // 强制应用 不然后续再设置动画没有效果
        // 强制刷新得先将节点加入DOM树中
        viewport.appendChild(container);
        if (backPage.hasVisited) {
            util.setStyles(
                container, 
                {
                    transform: 'translateX(-'+ frontPage.main.offsetWidth +'px)'
                }, 
                true
            );
        }

        return container;
    }

    /**
     * 转场结束
     * 恢复设置的样式属性
     *
     * @inner
     */
    function finish(frontPage, backPage, resolver) {
        var viewport = config.viewport;
        var backEle = backPage.main;
        var container = backEle.parentNode;
        
        // 还原设置的样式
        util.setStyles(backEle, {
            float: 'none',
            width: 'auto'
        });
        // 调整DOM结构
        // 删除container 只留下转场页面
        viewport.appendChild(backEle);
        viewport.removeChild(container);

        resolver.fulfill();
    }

    /**
     * 滑动转场
     *
     * @public
     * @param {Resolver} resolver Resolver对象
     * @param {Object} options 转场参数
     * @param {number} options.duration 动画时间 秒为单位
     * @param {string} options.timing 过渡速度曲线
     */
    function slide(resolver, options) {
        var duration = options.duration || config.duration;
        var timing = options.timing || config.timing;
        var frontPage = options.frontPage;
        var backPage = options.backPage;

        var container = prepare(frontPage, backPage);
        
        // 注册动画完成后执行结束处理
        util.one(
            container, 'transitionend', 
            curry(finish, frontPage, backPage, resolver)
        );

        // 如果已经访问过则使用右滑入
        // 正常情况使用左滑入
        util.setStyles(container, {
            transform: 'translateX('
                    + (backPage.hasVisited ? 0 : -frontPage.main.offsetWidth) 
                    + 'px)',
            // 不设置transition-property 
            // 不然又要写一堆-webkit- -ms- ...
            'transition-duration': duration + 's',
            'transition-timing-function': timing
        });
    }

    require('../transition').register('slide', slide);

    return slide;

});
