/**
 * @file ER适配器
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var events = require('er/events');
    var viewport = require('../main');

    var curPage;

    var blank = function () {};

    function init() {
        events.on('enteraction', function (context) {
            var page = viewport.load(context.url.getPath());

            // 重置action leave方法
            // 完成转场后再调用
            var leaveHandler = context.action.leave;
            context.action.leave = blank;
            page.on('leave', function () {
                leaveHandler.call(context.action);
            });

            // 修改ER的视图主区域
            var ele = page.main;
            ele.id = '_ER_MAIN_' + (new Date()).getTime() + '_';
            ele.style.display = 'none';
            document.body.appendChild(ele);
            context.action.on('beforerender', function () {
                this.view.container = ele.id;
            });

            curPage = page;
        });

        events.on('enteractioncomplete', function () {
            if (curPage) {
                curPage.main.style.display = '';
                curPage.enter();
            }
        });
    }

    return function (ele, options) {
        viewport.init(ele, options);
        init();
    };
});
