/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-16 20:10:08
 * @LastEditTime: 2019-08-16 23:08:16
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {
        canvas:cc.Node,
        // UI
        redUi:cc.Node,
        blueUi:cc.Node,
        uiHideDuration:0.5,
        // 开始按键
        startBtn:cc.Node,
        // 两个主角节点父节点
        playerNode:cc.Node,
        // 主角节点
        redPlayer:cc.Node,
        bluePlayer:cc.Node,
        showDuration:0.5,
        // 触摸区域
        redTouchRect:cc.Node,
        blueTouchRect:cc.Node,
        // 倒计时图片
        countDownPic:[cc.SpriteFrame],
        countSprite:cc.Sprite,
        // 警戒线节点
        cordonNode:cc.Node,
        // 每次点击移动的像素
        deltaMove:10,
        // 游戏开始标志
        _startFlag:false,
        // 触摸标志位
        _redTouchFlag:false,
        _blueTouchFlag:false,
        // 点击数
        _redTouchNum:0,
        _blueTouchNum:0,
    },

    onLoad () {
        // 初始化角色位置
        this.redPlayer.position = cc.v2(0,-2300);
        this.bluePlayer.position = cc.v2(0,2300);
        // 隐藏警戒线
        this.cordonNode.active = false;
    },

    startGame(){
        this._startFlag = true;
        // 按顺序执行流程
        let startAction = cc.sequence(cc.callFunc(this.hideUi,this),cc.callFunc(this.countDown,this));
        this.canvas.runAction(startAction);
    },

    // 隐藏UI
    hideUi(){
        this.startBtn.active = false;
        // 红色往右移，蓝色往左移
        // 隐藏UI动画
        let moveRight = cc.moveBy(this.uiHideDuration,cc.v2(800,0)).easing(cc.easeCubicActionOut());
        let moveLeft = cc.moveBy(this.uiHideDuration,cc.v2(-800,0)).easing(cc.easeCubicActionOut());
        let seqMoveRight = cc.sequence(moveRight,cc.callFunc(()=>{
            this.showPlayer(this.redPlayer)
        },this));
        let seqMoveLeft = cc.sequence(moveLeft,cc.callFunc(()=>{
            this.showPlayer(this.bluePlayer)
        },this));
        this.redUi.runAction(seqMoveRight);
        this.blueUi.runAction(seqMoveLeft);
    },

    // 展示主角
    showPlayer(node){
        // 显示警戒线
        this.cordonNode.active = true;
        // 播放入场
        let moveToStart = cc.moveTo(this.showDuration,cc.v2(0,0)).easing(cc.easeCubicActionOut());
        node.runAction(moveToStart);
    },

    // 倒计时
    countDown(){
        this._spriteIndex = 0;
        this.countSprite.node.active = true;
        this.countSprite.spriteFrame = this.countDownPic[this._spriteIndex];
        this.countSprite.schedule(()=>{
            this._spriteIndex++;
            this.countSprite.spriteFrame = this.countDownPic[this._spriteIndex];
            if(this._spriteIndex == 3){
                this.addTouchListen();
                this.countSprite.scheduleOnce(()=>{
                    this.countSprite.node.active = false;
                },0.5);
            }
        },1,3);
    },

    //开启点击区域监听
    addTouchListen(){
        this._startFlag = true;
        this.redTouchRect.on('touchstart', this.redMove,this);
        this.blueTouchRect.on('touchstart',this.blueMove,this);
        this.redTouchRect.on('touchend',this.redLabelUpdate,this);
        this.blueTouchRect.on('touchend',this.blueLabelUpdate,this);
    },
    removeTouchListen(){
        this._startFlag = false;
        this.redTouchRect.off('touchstart',this.redMove,this);
        this.blueTouchRect.off('touchstart',this.blueMove,this);
        this.redTouchRect.off('touchend',this.redLabelUpdate,this);
        this.blueTouchRect.off('touchend',this.blueLabelUpdate,this);
    },
    redLabelUpdate(){
        this._redTouchFlag = false;
        this._redTouchNum++;
        cc.log('redNum: '+this._redTouchNum);
    },
    blueLabelUpdate(){
        this._blueTouchFlag = false;
        this._blueTouchNum++;
        cc.log('blueNum: '+this._blueTouchNum);
    },
    redMove(){
        this._redTouchFlag = true;
        this.playerNode.y += this.deltaMove;
    },
    blueMove(){
        this._blueTouchFlag = true;
        this.playerNode.y -= this.deltaMove;
    },
    

    update (dt) {
        /*if(this._startFlag){
            if(this._redTouchFlag){
                this._redTouchFlag = false;
                this.playerNode.y += dt*this.deltaMove; 
            }
            if(this._blueTouchFlag){
                this._blueTouchFlag = false;
                this.playerNode.y -= dt*this.deltaMove; 
            }
        }*/
    },
});
