/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 21:08:59
 * @LastEditTime: 2019-08-17 22:01:06
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {
        menuNode:cc.Node,
        winerLabel:cc.Label,
    },

    onLoad () {
        this.menuNode.position = cc.v2(2000,0);
    },

    // 改变文本接口
    changeWinerText(text){
        this.winerLabel.string = text;
    },
    // 改变节点的背景颜色
    changeNodeColor(color){
        if(color == 'red'){
            this.menuNode.color = cc.color(236,69,69);
        }else if(color == 'blue'){
            this.menuNode.color = cc.color(32,173,228);
        }
    },
    // 隐藏
    hideMenu(){
        this.node.position = cc.v2(2000,0);
    },
    // show
    showMenu(){
        this.node.position = cc.v2(0,0);
    },

    backToMenu(){
        cc.director.emit('backMenu');
    },
});
