/**
 * Created by thaod.
 */

/**
 * Created by thaod on 6/20/2018.
 * MenuSceneLayer
 */


var PlaySceneLayer = cc.Layer.extend({

    bgImage: null,
    questionLabel: null,
    answerLabel:[],

    questionBg: null,
    answerBtn:[],

    dataQuestion: null,
    gameData: null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var layer = ccs.load(res.PlayScene_json);
        this.addChild(layer.node);

        this.bgImage = layer.node.getChildByName("bgImage");
        this.questionBg = this.bgImage.getChildByName("bg_question");
        var label = this.questionBg.getChildByName("lb_question");
        label.setVisible(false);

        var pos = label.getPosition();
        this.questionLabel = new cc.LabelBMFont("test case", res.BM_FONT, 200, cc.TEXT_ALIGNMENT_LEFT);
        this.questionLabel.setAnchorPoint(cc.p(0, 1));
        this.questionLabel.setPosition(pos);
        this.questionBg.addChild(this.questionLabel);
        this.questionLabel.setWidth(360);

        for (var i = 0; i < NUM_ANSWER; i ++){
            var btn = this.bgImage.getChildByName("btn_answer_"+ (i+1));
            var label = btn.getChildByName("lb_answer_"+(i+1));
            this.answerBtn.push(btn);
            this.answerLabel.push(label);

            btn.setTag(i);
            btn.addTouchEventListener(this.onAnswer, this);
        }

        this.updateData();

        return true;
    },

    updateData: function(){
        this.gameData = GameDataMgr.gameDataMgrInstance;
        this.dataQuestion = PlatformUtils.getInstance().getQuestion(this.gameData.currentLevel);
        cc.log("level "+ this.gameData.currentLevel);
        this.questionLabel.setString(this.dataQuestion.question);
        var answerArray = this.dataQuestion.getAnswerArr();
        for (var i = 0; i < NUM_ANSWER; i ++){
            this.answerLabel[i].setString(answerArray[i]);
        }
    },

    onAnswer: function(sender, controlEvent){
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            var idx = sender.getTag();
            cc.log("idx  = " + idx);
            if(idx +1 == this.dataQuestion.answer){
                this.nextLevel();
            } else {
                this.gameOver();
            }
        }
    },

    nextLevel: function(){
        cc.log("next level =  " + this.gameData.currentLevel);
        this.runNextLevelEffect();
    },

    runNextLevelEffect: function(){
        this.runNextLevelEffectDone();
    },

    runNextLevelEffectDone: function(){
        this.gameData.nextLevel();
        this.updateData();
    },

    gameOver: function(){
        cc.log("game Over");
    }

});
