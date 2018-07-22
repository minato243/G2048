/**
 * Created by thaod on 6/20/2018.
 * MenuSceneLayer
 */


var MenuSceneLayer = cc.Layer.extend({

    bgImage: null,
    playButton: null,
    highScoreButton: null,
    gameData: null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var menuScene = ccs.load(res.MenuScene_json);
        this.addChild(menuScene.node, 1);

        this.bgImage = menuScene.node.getChildByName("bgImage");
        this.playButton = this.bgImage.getChildByName("btn_play");
        this.highScoreButton = this.bgImage.getChildByName("btn_high_score");

        var bgSelect = this.bgImage.getChildByName("bg_menu");
        this.nextButton = bgSelect.getChildByName("btn_next");
        this.previousButton = bgSelect.getChildByName("btn_previous");

        this.nextButton.addTouchEventListener(this.onNextMode, this);
        this.previousButton.addTouchEventListener(this.onPreviousMode, this);

        this.modeImage = this.bgImage.getChildByName("img_mode");
        this.modeLabel = bgSelect.getChildByName("lb_mode");

        this.playButton.addClickEventListener(this.onPlay);
        this.highScoreButton.addClickEventListener(this.onHighScore);

        this.initData();
        return true;
    },

    initData: function(){
        this.gameData = GameDataMgr.gameDataMgrInstance;
        this.updateSelectedMode();
    },

    updateSelectedMode: function(){
        cc.log("updateSelectedMode");
        cc.Sprite.create("#ic_mode_2.png");
        var spriteFrameStr = "ic_mode_"+ String(this.gameData.mode+1)+".png";
        cc.log(spriteFrameStr);
        this.modeImage.setSpriteFrame(spriteFrameStr);

        var modeStr = GAME_MATRIX_SIZE[this.gameData.mode]+"X"+GAME_MATRIX_SIZE[this.gameData.mode];
        cc.log(modeStr);
        this.modeLabel.setString(modeStr);
    },

    onPlay: function(){
        cc.log("onClickPlay");
        SoundManager.playClickSound();
        ScreenMgr.getInstance().changeScreen(PLAY_SCREEN);
    },

    onClickExit: function(){
        cc.log("onClickExit");
        cc.director.end();
    },

    onHighScore: function(){
        cc.log("onClickHighScore");

    },

    onNextMode: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            cc.log("onNextMode");
            this.gameData.nextMode();
            this.updateSelectedMode();
        }

    },

    onPreviousMode: function(pSender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            cc.log("onNextMode");
            this.gameData.previousButton();
            this.updateSelectedMode();
        }
    }
});
