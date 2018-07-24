/**
 * Created by thaod.
 */

/**
 * Created by thaod on 6/20/2018.
 * MenuSceneLayer
 */


var PlaySceneLayer = cc.Layer.extend({

    bgImage: null,
    bgMode: null,
    board: null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var layer = ccs.load(res.PlayScene_json);
        this.addChild(layer.node);

        this.bgImage = layer.node.getChildByName("bgImage");
        this.bgMode = this.bgImage.getChildByName("bg_mode");

        this.initData();
        this.updateData();
        this.addListener();

        return true;
    },

    addListener: function(){
        var self = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            touchBeganPos:null,

            onTouchBegan: function (touch, event) {
                this.touchBeganPos = touch.getLocation();
                cc.log("onTouchBegan "+ this.touchBeganPos.x+" "+ this.touchBeganPos.y);
                return true;
            },

            onTouchEnded: function (touch, event) {
                var pos = touch.getLocation();
                cc.log("onTouchEnded ("+ pos.x+" "+pos.y+"), touchBegan ("+ this.touchBeganPos.x+" "+ this.touchBeganPos.y+")");
                if(pos.x - this.touchBeganPos.x > 20) self.board.moveRightAndAddNewNumber();
                else if(pos.x - this.touchBeganPos.x < -20) self.board.moveLeftAndAddNewNumber();
                else if(pos.y - this.touchBeganPos.y > 20) self.board.moveUpAndAddNewNumber();
                else if(pos.y - this.touchBeganPos.y < -20) self.board.moveDownAndAddNewNumber();

                cc.log(self.board.getMatrixString());
                return true;
            }

        });

        cc.eventManager.addListener(touchListener, this.bgMode);
    },


    initData: function(){
        this.gameData = GameDataMgr.gameDataMgrInstance;
        this.board = new Board(GAME_MATRIX_SIZE[this.gameData.mode]);
        cc.log(this.board.getMatrixString());
    },

    updateData: function(){
        var sprite = cc.Sprite.create("res/bg_mode_"+(this.gameData.mode + 1)+".png");
        this.bgMode.setSpriteFrame(sprite.getSpriteFrame());

    },

    gameOver: function(){
        cc.log("game Over");
    }

});
