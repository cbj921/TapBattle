/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-18 15:01:30
 * @LastEditTime: 2019-08-18 15:08:21
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {
        menuBgm:{
            default:null,
            type:cc.AudioClip,
        },
        battleBgm:{
            default:null,
            type:cc.AudioClip,
        },
        buttonEffect:{
            default:null,
            type:cc.AudioClip,
        }
    },

    onLoad () {
        cc.audioEngine.playMusic(this.menuBgm);
        cc.director.on('backMenu',this.backMenu,this);
        cc.director.on('startGame',this.startGame,this);
    },

    backMenu(){
        cc.audioEngine.playMusic(this.menuBgm);
    },

    startGame(){
        cc.audioEngine.playMusic(this.battleBgm);
    },

    // 按钮点击音效
    buttonClick(){
        cc.audioEngine.playEffect(this.buttonEffect);
    },

    // update (dt) {},
});
