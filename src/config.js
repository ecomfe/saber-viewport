/**
 * @file 默认全局配置
 * @author treelite(c.xinle@gmail.com)
 */

define({
    /**
     * 默认转场效果
     *
     * @type {boolean|string}
     */
    transition: true,

    /**
     * 默认效果时长
     * @type {number}
     */
    duration: 0.3,

    /**
     * 默认转场过渡速度曲线
     * @type {string}
     */
    timing: 'ease',

    /**
     * 是否使用transform转场效果
     * @type {boolean}
     */
    transform: true,


    /**
     * 转场mask 默认开启
     * @type {boolean}
     */
    mask: true,

    /**
     * 容器元素
     * 目前用于计算转场时页面滚动高度
     * @type {HTMLElement}
     */
    container: document.body
});
