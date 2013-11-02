/**
 * @file action config
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {

    var actionsConfig = [
            {
                type: 'disease/home',
                path: '/disease/home'
            }
        ];

    var controller = require('er/controller');

    actionsConfig.forEach(function (item) {
        controller.registerAction(item);
    });

    var config = {};

    return config;

});
