/*
 * @Description: In User Settings Edit
 * @Author: cbj921
 * @Date: 2019-08-16 18:41:58
 * @LastEditTime: 2019-08-16 18:51:23
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {
        moveDuration:0.5,
        offsetY:50,
    },

    onLoad () {
        let upAct = cc.moveBy(this.moveDuration,cc.v2(0,this.offsetY)).easing(cc.easeSineIn());
        let downAct = cc.moveBy(this.moveDuration,cc.v2(0,-this.offsetY)).easing(cc.easeSineOut());
        let seqAct = cc.sequence(upAct,downAct);

        this.node.runAction(cc.repeatForever(seqAct));
        
    },

    // update (dt) {},
});
