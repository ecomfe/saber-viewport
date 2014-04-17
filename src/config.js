/**
 * @file 默认全局配置
 * @author treelite(c.xinle@gmail.com)
 */

define({
    /**
     * 视图容器
     * @type {HTMLElement}
     */
    viewport: null,

    /**
     * 默认转场效果
     * @type {string}
     */
    transition: 'slide',

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
     * loading文案
     * @type {string|boolean|function}
     */
    loading: false   
});
