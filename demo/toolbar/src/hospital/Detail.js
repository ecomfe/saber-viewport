/**
 * @file Detail
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {

    var Action = require('er/Action');

    function Detail() {
        Action.apply(this, arguments);
    }

    Detail.prototype = {
        viewType: require('./DetailView')
    };

    require('er/util').inherits(Detail, Action);

    return Detail;
});
