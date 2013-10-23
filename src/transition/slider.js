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
        viewport.appendChild(container);
    }

    /**
     * 转场结束
     * 恢复设置的样式属性
     *
     * @inner
     */
    function finish(frontPage, backPage) {
        var viewport = config.viewport;
        var backEle = backPage.main;
        var container = backEle.parentNode;
        
        // 还原设置的样式
        util.setStyles(backEle, {
            float: 'none',
            width: 'auto'
        });
        // 调整DOM接口 
        // 删除container 只留下转场页面
        viewport.appendChild(backEle);
        viewport.removeChild(container);
    }

    /**
     * 滑动转场
     *
     * @public
     * @param {Object} options 转场参数
     * @param {number} options.duration 动画时间 秒为单位
     * @param {string} options.timing 过渡速度曲线
     */
    function slider(options) {
        var duration = options.duration || config.duration;
        var timing = options.timing || config.timing;
        var frontPage = options.frontPage;
        var backPage = options.backPage;

        var container = prepare(frontPage, backPage);

        // 如果已经访问过则使用右滑入
        // 正常情况使用左滑入
        if (backPage.hasVisited) {
            // TODO 最好还是不要链式调用了...
            util.setStyles(container, {
                marginLeft: - frontPage.main.offsetWidth + 'px'
            }).set({
                marginLeft: '0',
                transition: 'margin-left ' + duration + 's ' + timing
            });
        }
        else {
            util.setStyles(container, {
                marginLeft: - frontPage.main.offsetWidth + 'px',
                transition: 'margin-left ' + duration + 's ' + timing
            });
        }

        // 动画完成后执行结束处理
        setTimeout(
            curry(finish, frontPage, backPage),
            duration * 100
        );
    }

    require('../transition').register('slider', slider);

    return slider;

});
