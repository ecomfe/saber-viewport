/**
 * @file 淡入淡出
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var util = require('../util');
    var config = require('../config');

    function fadeInOut(resolver, options) {
        var duration = options.duration || config.duration;
        var timing = options.timing || config.timing;
        var backPage = options.backPage;
        var frontPage = options.frontPage;
        var backEle = backPage.main;
        var frontEle = frontPage.main;

        config.viewport.insertBefore(backEle, frontEle);
        util.setStyles(
            backEle, 
            {
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0
            }, 
            true
        );

        util.setStyles(backEle, {
            opacity: 1,
            transition: 'opacity ' + duration + 's ' + timing
        });

        util.setStyles(frontEle, {
            opacity: 0,
            transition: 'opacity ' + duration + 's ' + timing
        });

        setTimeout(
            function () {
                util.setStyles(backEle, {
                    position: 'static',
                    transition: '0s'
                });
                resolver.fulfill();
            }, 
            duration * 1000
        );
    }

    require('../transition').register('fadeInOut', fadeInOut);

    return fadeInOut;
});
