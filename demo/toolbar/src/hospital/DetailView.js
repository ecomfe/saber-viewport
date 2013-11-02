/**
 * @file Home View
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {

    require('er/tpl!./detail.tpl.html');

    var View = require('er/View');

    function DetailView() {
        View.apply(this, arguments);
    }

    DetailView.prototype.template = 'hospitalDetail';

    DetailView.prototype.enterDocument = function () {};

    require('er/util').inherits(DetailView, View);

    return DetailView;
});
