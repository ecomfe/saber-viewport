/**
 * @file mask
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var mask;

    function create() {
        mask = document.createElement('div');
        mask.className = exports.className;
        mask.style.cssText += ';display:none;position:fixed;top:0;right:0;bottom:0;left:0;z-index:100';
        document.body.appendChild(mask);
    }

    var exports = {};

    exports.className = 'saber-viewport-mask';

    exports.show = function () {
        if (!mask) {
            create();
        }
        mask.style.display = '';
    };

    exports.hide = function () {
        if (!mask) {
            create();
        }
        mask.style.display = 'none';
    };

    return exports;
});
