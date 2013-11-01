/**
 * @file 淡入淡出
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var curry = require('saber-lang/curry');
    var util = require('../util');
    var config = require('../config');
    var runner = require('saber-run');

    function finish(backPage, resolver) {
        var backEle = backPage.main;

        util.setStyles(backEle, {
            position: 'static'
        });
        resolver.fulfill();
    }

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

        runner.transition(
            backEle, 
            { opacity: 1 },
            {
                duration: duration,
                timing: timing
            }
        );

        var promise = runner.transition(
            frontEle, 
            { opacity: 0 },
            {
                duration: duration,
                timing: timing
            }
        );

        promise.then(curry(finish, backPage, resolver));

    }

    require('../transition').register('fadeInOut', fadeInOut);

    return fadeInOut;
});
