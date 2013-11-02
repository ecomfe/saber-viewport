/**
 * @file action config
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {

    var actionsConfig = [
            {
                type: 'hospital/home',
                path: '/hospital/home'
            },
            {
                type: 'hospital/detail',
                path: '/hospital/detail'
            }
        ];

    var controller = require('er/controller');

    actionsConfig.forEach(function (item) {
        controller.registerAction(item);
    });

    var config = {};

    return config;

});
