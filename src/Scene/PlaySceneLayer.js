/**
 * Created by thaod.
 */

var DRAG_DISTANCE = 30;

var PlaySceneLayer = cc.Layer.extend({

    bgImage: null,
    bgMode: null,
    restartButton: null,
    undoButton: null,
    pauseButton: null,
    scoreLabel: null,
    highScoreLabel: null,
    homeButton: null,
    soundOnButton: null,
    soundOffButton: null,

    board: null,
    bgNumberList: [],
    numberLabelList:[],

    savedData: "",

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.initGui();
        this.initData();
        this.addListener();

        return true;
    },

    initGui: function(){
        var layer = ccs.load(res.PlayScene_json);
        this.addChild(layer.node);

        this.bgImage = layer.node.getChildByName("bgImage");
        this.bgMode = this.bgImage.getChildByName("bg_mode");

        this.homeButton = this.bgImage.getChildByName("btn_home");
        this.soundOnButton = this.bgImage.getChildByName("btn_sound_on");
        this.soundOffButton = this.bgImage.getChildByName("btn_sound_off");
        this.restartButton = this.bgImage.getChildByName("btn_restart");
        this.undoButton = this.bgImage.getChildByName("btn_undo");
        this.pauseButton = this.bgImage.getChildByName("btn_pause");
        this.scoreLabel = this.bgImage.getChildByName("bg_score").getChildByName("lb_core");
        this.highScoreLabel = this.bgImage.getChildByName("bg_high_score").getChildByName("lb_high_score");

        this.homeButton.addTouchEventListener(this.onHome, this);
        this.soundOnButton.addTouchEventListener(this.onSoundOn, this);
        this.soundOffButton.addTouchEventListener(this.onSoundOff, this);
        this.undoButton.addTouchEventListener(this.onUndo, this);
        this.restartButton.addTouchEventListener(this.onRestart, this);
    },

    addListener: function(){
        var self = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            touchBeganPos:null,

            onTouchBegan: function (touch, event) {
                this.touchBeganPos = touch.getLocation();
                cc.log("onTouchBegan "+ this.touchBeganPos.x+" "+ this.touchBeganPos.y);
                return true;
            },

            onTouchEnded: function (touch, event) {
                var pos = touch.getLocation();
                cc.log("onTouchEnded ("+ pos.x+" "+pos.y+"), touchBegan ("+ this.touchBeganPos.x+" "+ this.touchBeganPos.y+")");

                var dX = pos.x - this.touchBeganPos.x;
                var dY = pos.y - this.touchBeganPos.y;
                if( dX > DRAG_DISTANCE || dX < -DRAG_DISTANCE
                    || dY > DRAG_DISTANCE || dY < -DRAG_DISTANCE)
                {
                    if(Math.abs(dX) > Math.abs(dY )){
                        if(dX > DRAG_DISTANCE) self.board.moveRightAndAddNewNumber();
                        else self.board.moveLeftAndAddNewNumber();
                    } else {
                        if(dY > DRAG_DISTANCE) self.board.moveUpAndAddNewNumber();
                        else self.board.moveDownAndAddNewNumber();
                    }
                    self.updateData();
                    if(!self.board.canMove()){
                        cc.log("can not move");
                        GameOverDialog.destroyInstance();
                        GameOverDialog.getInstance().startDialog(self.board.score, self.board.getMaxNumber(), self);
                        self.gameData.saveData(self.gameData.mode, "");
                    }
                    cc.log(self.board.getMatrixString());
                }
                return true;
            }

        });

        cc.eventManager.addListener(touchListener, this.bgMode);
    },

    initListNumber: function(){
        var mode = this.gameData.mode;
        var imageSize = IMAGE_SIZE[this.gameData.mode];
        this.bgMode.removeAllChildren();
        this.bgNumberList = [];
        this.numberLabelList = [];
        for (var i = 0; i < this.board.size; i++){
            this.bgNumberList.push([]);
            this.numberLabelList.push([]);
            for (var j = 0; j < this.board.size ; j ++){
                var numberBgImage = cc.Sprite.create("#item/bg_2.png");
                numberBgImage.setPosition(cc.p(POS_X[mode][j], POS_Y[mode][this.board.size - i - 1]));
                this.bgMode.addChild(numberBgImage);
                this.bgNumberList[i].push(numberBgImage);
                var scaleRate = imageSize/ numberBgImage.getContentSize().width;
                cc.log (numberBgImage +"scaleRate "+scaleRate+" "+numberBgImage.getContentSize().width);
                numberBgImage.setScale(scaleRate);

                var numberLabel = new cc.LabelBMFont("2", res.FONT_BRL_48, 0, cc.TEXT_ALIGNMENT_CENTER);
                numberBgImage.addChild(numberLabel);
                numberLabel.setPosition(cc.p(numberBgImage.getContentSize().width/2, numberBgImage.getContentSize().height/2));
                numberLabel.setScale(1/scaleRate);
                cc.log("bg size "+ numberBgImage.getContentSize().width/2);
                this.numberLabelList[i].push(numberLabel);

                numberBgImage.setVisible(false);
            }
        }
    },

    initData: function(){
        this.gameData = GameDataMgr.gameDataMgrInstance;
        SoundManager.getInstance();
        this.board = new Board(GAME_MATRIX_SIZE[this.gameData.mode]);
        this.savedData = this.gameData.loadData(this.gameData.mode)
        if(this.savedData == ""){
            this.board.createNewMatrix();
            this.initListNumber();
            this.updateData();
        } else{
            MessageDialog.destroyInstance();
            var acceptCallBack = cc.callFunc(this.loadData, this);
            var rejectCallBack = cc.callFunc(this.createNewGame, this);
            MessageDialog.getInstance().startDialog(acceptCallBack, rejectCallBack, "Continue the last one\n or start new game?");
        }

        this.soundOnButton.setVisible(SoundManager.instance.status);
        this.soundOffButton.setVisible(!SoundManager.instance.status);
    },

    loadData: function(){
        this.board.convertDataFromString(this.savedData);
        this.initListNumber();
        this.updateData();
    },

    createNewGame: function(){
        this.board.createNewMatrix();
        this.initListNumber();
        this.updateData();
    },

    updateData: function(){
        var spriteFrameName = "res/bg_mode_"+(this.gameData.mode + 1)+".png";
        cc.log("updateData "+ spriteFrameName);
        var sprite = cc.Sprite.create(spriteFrameName);
        this.bgMode.setSpriteFrame(sprite.getSpriteFrame());

        this.highScoreLabel.setString(this.gameData.highScore.toString());

        for (var i = 0; i < this.board.size; i ++){
            for (var j = 0; j < this.board.size; j ++){
                if(this.board.matrix[i][j] == undefined || this.board.matrix[i][j] == 0){
                    this.bgNumberList[i][j].setVisible(false);
                } else {
                    this.bgNumberList[i][j].setVisible(true);
                    this.bgNumberList[i][j].setSpriteFrame(this.getSpriteFrameNameForNumber(this.board.matrix[i][j]));
                    this.numberLabelList[i][j].setString(this.board.matrix[i][j].toString());
                }

            }
        }

        this.scoreLabel.setString(this.board.score.toString());
    },

    gameOver: function(){
        cc.log("game Over");
    },

    onHome: function(pSender, controlEvent){
        cc.log("onHome");
        Utility.setScaleWhenTouchButton(pSender, controlEvent);

        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            ScreenMgr.screenMgrInstance.changeScreen(MENU_SCREEN)
            this.saveCurrentData();
        }
    },

    onSoundOn: function(pSender, controlEvent){
        cc.log("onSoundOn");
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.instance.setMusicOff();
            this.soundOffButton.setVisible(true);
            this.soundOnButton.setVisible(false);
        }
    },

    onSoundOff: function(pSender, controlEvent){
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.instance.setMusicOn();
            this.soundOffButton.setVisible(false);
            this.soundOnButton.setVisible(true);
        }
    },

    onUndo: function(pSender, controlEvent){
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            this.board.undo();
            this.updateData();

            cc.log(this.board.getMatrixString());
        }
    },

    onRestart: function(pSender, controlEvent){
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            var acceptCallBack = cc.callFunc(this.startNewGame, this);
            MessageDialog.destroyInstance();
            MessageDialog.getInstance().startDialog(acceptCallBack, null, "Are you sure to start a new game?");
        }
    },

    getSpriteFrameNameForNumber: function(number){
        return "item/bg_"+number+".png";
    },

    startNewGame: function(){
        this.board.createNewMatrix();
        this.updateData();
    },

    saveCurrentData: function(){
        this.gameData.saveData(this.gameData.mode, this.board.convertDataToSaveString());
    }
});

PlaySceneLayer.playLayerInstance = null;

PlaySceneLayer.getInstance = function(){
    if(PlaySceneLayer.playLayerInstance == null){
        PlaySceneLayer.playLayerInstance = new PlaySceneLayer();
        PlaySceneLayer.playLayerInstance.retain();
    }
    return PlaySceneLayer.playLayerInstance;
};
