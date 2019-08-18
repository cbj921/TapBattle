/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-16 20:10:08
 * @LastEditTime: 2019-08-18 15:19:18
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
        // title节点
        titleNode:cc.Node,
        // UI
        redUi: cc.Node,
        blueUi: cc.Node,
        uiHideDuration: 0.5,
        // 开始按键
        startBtn: cc.Node,
        // 两个主角节点父节点
        playerNode: cc.Node,
        // 主角节点
        redPlayer: cc.Node,
        bluePlayer: cc.Node,
        showDuration: 0.5,
        // 触摸区域
        redTouchRect: cc.Node,
        blueTouchRect: cc.Node,
        // 倒计时图片
        countDownPic: [cc.SpriteFrame],
        countSprite: cc.Sprite,
        // 警戒线节点
        cordonNode: cc.Node,
        // 每次点击移动的像素
        deltaMove: 10,
        // 角色的精灵图片
        redSpriteFrame: [cc.SpriteFrame],
        blueSpriteFrame: [cc.SpriteFrame],
        // 点击数标签节点
        numLabelNode:cc.Node,
        redNumLabel:cc.Label,
        blueNumLabel:cc.Label,
        // 游戏结束的节点
        gameOverNode:cc.Node,
        // 游戏开始标志
        _startFlag: false,
        // 触摸标志位
        _redTouchFlag: false,
        _blueTouchFlag: false,
        // 点击数
        _redTouchNum: 0,
        _blueTouchNum: 0,
        // 倒计时图片的下标
        _spriteIndex: 0,
        // 角色图片的切换标志位
        _changeFlag: false,
    },

    onLoad() {
        // 初始化角色位置
        this.redPlayer.position = cc.v2(0, -2300);
        this.bluePlayer.position = cc.v2(0, 2300);
        // 隐藏警戒线
        this.cordonNode.active = false;
        // 隐藏点击数
        this.numLabelNode.active = false;
        // 监听playAgain事件
        cc.director.on('backMenu',this.backMenu,this);
        // 播放动画
        this.playerAnim();
    },

    startGame() {
        this._startFlag = true;
        // 隐藏标题
        this.titleNode.active = false;
        // 显示点击数并且初始化
        this.numLabelNode.active = true;
        this.redNumLabel.string = 0;
        this.blueNumLabel.string = 0;
        // 按顺序执行流程
        let startAction = cc.sequence(cc.callFunc(this.hideUi, this), cc.callFunc(this.countDown, this));
        this.canvas.runAction(startAction);
        // 向全局发送游戏开始事件
        cc.director.emit('startGame');
    },

    // 隐藏UI
    hideUi() {
        this.startBtn.active = false;
        // 红色往右移，蓝色往左移
        // 隐藏UI动画
        let moveRight = cc.moveBy(this.uiHideDuration, cc.v2(800, 0)).easing(cc.easeCubicActionOut());
        let moveLeft = cc.moveBy(this.uiHideDuration, cc.v2(-800, 0)).easing(cc.easeCubicActionOut());
        let seqMoveRight = cc.sequence(moveRight, cc.callFunc(() => {
            this.showPlayer(this.redPlayer)
        }, this));
        let seqMoveLeft = cc.sequence(moveLeft, cc.callFunc(() => {
            this.showPlayer(this.bluePlayer)
        }, this));
        this.redUi.runAction(seqMoveRight);
        this.blueUi.runAction(seqMoveLeft);
    },
    //redUI 和 blueUI 归位动画
    showUi(){
        let moveRight = cc.moveBy(this.uiHideDuration, cc.v2(800, 0)).easing(cc.easeCubicActionOut());
        let moveLeft = cc.moveBy(this.uiHideDuration, cc.v2(-800, 0)).easing(cc.easeCubicActionOut());
        this.redUi.runAction(moveLeft);
        this.blueUi.runAction(moveRight);
    },

    // 展示主角
    showPlayer(node) {
        // 显示警戒线
        this.cordonNode.active = true;
        // 初始化角色的sprite
        let redSprite = this.redPlayer.getComponent(cc.Sprite);
        let blueSprite = this.bluePlayer.getComponent(cc.Sprite);
        redSprite.spriteFrame = this.redSpriteFrame[0];
        blueSprite.spriteFrame = this.blueSpriteFrame[0];
        // 播放入场
        let moveToStart = cc.moveTo(this.showDuration, cc.v2(0, 0)).easing(cc.easeCubicActionOut());
        node.runAction(moveToStart);
    },

    // 倒计时
    countDown() {
        this._spriteIndex = 0;
        this.countSprite.node.active = true;
        this.countSprite.spriteFrame = this.countDownPic[this._spriteIndex];
        this.countSprite.schedule(() => {
            this._spriteIndex++;
            this.countSprite.spriteFrame = this.countDownPic[this._spriteIndex];
            if (this._spriteIndex == 3) {
                this.addTouchListen();
                this.countSprite.scheduleOnce(() => {
                    this.countSprite.node.active = false;
                    this._spriteIndex = 0;
                }, 0.5);
            }
        }, 1, 3);
    },

    //开启点击区域监听
    addTouchListen() {
        this._startFlag = true;
        this.redTouchRect.on('touchstart', this.redMove, this);
        this.blueTouchRect.on('touchstart', this.blueMove, this);
        this.redTouchRect.on('touchend', this.redLabelUpdate, this);
        this.blueTouchRect.on('touchend', this.blueLabelUpdate, this);
    },
    removeTouchListen() {
        this._startFlag = false;
        this.redTouchRect.off('touchstart', this.redMove, this);
        this.blueTouchRect.off('touchstart', this.blueMove, this);
        this.redTouchRect.off('touchend', this.redLabelUpdate, this);
        this.blueTouchRect.off('touchend', this.blueLabelUpdate, this);
        this._redTouchNum = 0;
        this._blueTouchNum = 0;
    },
    redLabelUpdate() {
        this._redTouchFlag = false;
        this._redTouchNum++;
        this.redNumLabel.string = this._redTouchNum;
        //cc.log('redNum: ' + this._redTouchNum);
    },
    blueLabelUpdate() {
        this._blueTouchFlag = false;
        this._blueTouchNum++;
        this.blueNumLabel.string = this._blueTouchNum;
        //cc.log('blueNum: ' + this._blueTouchNum);
    },
    redMove() {
        this._redTouchFlag = true;
        this.playerNode.y += this.deltaMove;
        this.judgeWiner();
    },
    blueMove() {
        this._blueTouchFlag = true;
        this.playerNode.y -= this.deltaMove;
        this.judgeWiner();
    },
    // 判断赢家
    judgeWiner() {
        if (this.playerNode.y >= 500) {
            this.removeTouchListen();
            // 弹出结算界面
            this.gameOverNode.getComponent('gameOver').showMenu();
            this.gameOverNode.getComponent('gameOver').changeWinerText('Red Win !');
            this.gameOverNode.getComponent('gameOver').changeNodeColor('red');
            // TODO: 保存胜局数进存储
            // ....
            
        } else if (this.playerNode.y <= -500) {
            this.removeTouchListen();
            // 弹出结算界面
            this.gameOverNode.getComponent('gameOver').showMenu();
            this.gameOverNode.getComponent('gameOver').changeWinerText('Blue Win !');
            this.gameOverNode.getComponent('gameOver').changeNodeColor('blue');
            // TODO: 保存胜局数进存储
            // ....
        }
        // 判断距离来更换spriteFrame
        if ((!this._changeFlag) && (this.playerNode.y >= 200 || this.playerNode.y <= -200)) {
            this._changeFlag = true;
            let redSprite = this.redPlayer.getComponent(cc.Sprite);
            let blueSprite = this.bluePlayer.getComponent(cc.Sprite);
            redSprite.spriteFrame = this.redSpriteFrame[1];
            blueSprite.spriteFrame = this.blueSpriteFrame[1];
        }
        if (this._changeFlag && (this.playerNode.y < 200 && this.playerNode.y > -200)) {
            this._changeFlag = false;
            let redSprite = this.redPlayer.getComponent(cc.Sprite);
            let blueSprite = this.bluePlayer.getComponent(cc.Sprite);
            redSprite.spriteFrame = this.redSpriteFrame[0];
            blueSprite.spriteFrame = this.blueSpriteFrame[0];
        }
    },

    backMenu(){
        this.gameOverNode.getComponent('gameOver').hideMenu();
        // 归位playerNode
        this.playerNode.position = cc.v2(0,0);
        // 初始化角色位置
        this.redPlayer.position = cc.v2(0, -2300);
        this.bluePlayer.position = cc.v2(0, 2300);
        // 显示开始按钮
        this.startBtn.active = true;
        // 隐藏警戒线
        this.cordonNode.active = false;
        // 隐藏点击数
        this.numLabelNode.active = false;
        // 显示标题
        this.titleNode.active = true;
        // redUI 和 blueUI 归位动画
        this.showUi();
    },
    
    // 角色动画
    playerAnim(){
        let redAction = cc.repeatForever(cc.sequence(cc.moveBy(1,cc.v2(0,50)),cc.moveBy(1,cc.v2(0,-50))));
        let blueAction = cc.repeatForever(cc.sequence(cc.moveBy(1,cc.v2(0,-50)),cc.moveBy(1,cc.v2(0,50))));
        this.redUi.getChildByName('red').runAction(redAction);
        this.blueUi.getChildByName('blue').runAction(blueAction);
    },

});
