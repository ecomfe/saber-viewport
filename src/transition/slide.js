/**
 * @file 滑动转场
 * @authro treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var curry = require('saber-lang/curry');
    var runner = require('saber-run');
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
                    transform: 'translate3d(-'+ frontPage.main.offsetWidth +'px, 0, 0)'
                }, 
                true
            );
        }

        return container;
    }

    /**
     * 获取两个对象相同的属性
     *
     * @inner
     * @param {Object} obj1
     * @param {Object} obj2
     * @return {Array.<string>}
     */
    function getCommonKey(obj1, obj2) {
        var res = [];
        Object.keys(obj1).forEach(function (key) {
            if (key in obj2) {
                res.push(key);
            }
        });

        return res;
    }

    /**
     * 准备bar元素
     * 相同类型的bar 如果name相同不需要换场效果
     * 如果name不同需要滑入渐变转场效果
     *
     * @inner
     */
    function prepareBars(frontPage, backPage) {
        // 获取相同的类型的bar
        var keys = getCommonKey(
                frontPage.bars || {}, 
                backPage.bars || {}
            );

        var res = [];
        keys.forEach(function (key) {
            var item = {
                    front: frontPage.bars[key],
                    back: backPage.bars[key]
                };

            // name相同表示bar不需要转场效果
            // name不同表示bar要进行滑入渐变转场
            item.change = item.front.getAttribute('data-name') 
                            != item.back.getAttribute('data-name');

            var front = item.front;
            // 创建一个替代元素进行占位
            var ele = item.frontBlock = document.createElement(front.tagName);
            ele.className = front.className;
            ele.style.cssText += ';' 
                                + front.style.cssText
                                + ';padding:0;border:0'
                                + ';width:' + front.offsetWidth + 'px'
                                + ';height:' + front.offsetHeight + 'px';

            var pos = util.getPosition(front);
            front.parentNode.insertBefore(ele, front);

            // 将前页中的bar绝对定位
            // 遮挡住后页相同位置的带转入bar
            ele = front;
            item.frontCSSBack = ele.style.cssText;
            var size = util.getSize(ele);
            ele.style.width = size.width + 'px';
            ele.style.height = size.height + 'px';
            ele.style.position = 'absolute';
            ele.style.top = pos.top + 'px';
            ele.style.left = pos.left + 'px';
            document.body.appendChild(ele);
            // 强制刷新
            !!ele.offsetWidth;

            res.push(item);
        });

        return res;
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

        var bars = prepareBars(frontPage, backPage);

        // bar处理
        bars.forEach(function (item) {
            var frontBar = item.front;
            var frontBarBlock = item.frontBlock;
            var frontBarCSSBack = item.frontCSSBack;

            // 设置前页bar的转化效果
            runner.transition(
                frontBar, 
                { opacity: 0 },
                {
                    // 如果不需要转场效果则设置成突变转化
                    // android 2.3 不支持 steps
                    // 改用delay模拟
                    duration: item.change ? duration : 0.1,
                    timing: timing,
                    delay: item.change ? 0 : duration
                }
            ).then(function () {
                // 恢复前页的bar
                // 删除占位用的bar
                var parentNode = frontBarBlock.parentNode;
                frontBar.style.cssText += ';' + frontBarCSSBack;
                parentNode.insertBefore(frontBar, frontBarBlock);
                parentNode.removeChild(frontBarBlock);
            });
        });

        // 如果已经访问过则使用右滑入
        // 正常情况使用左滑入
        var value = backPage.hasVisited ? 0 : -frontPage.main.offsetWidth;
        var promise = runner.transition(
                container,
                { transform: 'translate3d(' + value + 'px, 0, 0)' },
                {
                    duration: duration,
                    timing: timing
                }
            );

        // 动画完成后执行finish收尾工作
        promise.then(curry(finish, frontPage, backPage, resolver));
    }

    require('../transition').register('slide', slide);

    return slide;

});
