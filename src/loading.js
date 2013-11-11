/**
 * @file 加载中提示
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

    var maskEle;
    var tipEle;

    function create() {
        maskEle = document.createElement('div');
        maskEle.className = 'saber-viewport-mask';
        maskEle.style.cssText += ';position:absolute'
                                + ';top:0;right:0;bottom:0;left:0'
                                + ';background:#000'
                                + ';opacity:0.1'
                                + ';display:none';

        tipEle = document.createElement('div');
        tipEle.className = 'saber-viewport-loading';
        tipEle.style.cssText += ';position:absolute'
                                + ';top:50%;left:50%'
                                + ';display:none';

        document.body.appendChild(maskEle);
        document.body.appendChild(tipEle);
    }

    function show(content) {
        if (!maskEle) {
            create();
        }

        if (typeof content == 'string' 
            || content instanceof String
        ) {
            tipEle.innerHTML = content;
        }
        else {
            content(tipEle);
        }
        maskEle.style.display = '';
        tipEle.style.display = '';
        tipEle.style.marginLeft = -1 * tipEle.offsetWidth / 2 + 'px';
        tipEle.style.marginTop = -1 * tipEle.offsetHeight / 2 + 'px';
    }

    function hide() {
        if (maskEle) {
            maskEle.style.display = 'none';
            tipEle.style.display = 'none';
        }
    }

    return {
        show: show,
        hide: hide
    };
});
