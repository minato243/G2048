/**
 * Created by thaod
 */

var GameDataMgr = cc.Class.extend({
    mode: 1,
    currentLevel: 0,

    ctor: function(){
        this.mode = 1;
    },

    nextMode: function(){
        this.mode = (this.mode + 1) % NUM_MODE;
    },

    previousMode: function(){
        this.mode = (this.mode + NUM_MODE - 1) %NUM_MODE;
    },

    resetData: function(){
        this.currentLevel = 0;
    },

    gameOver: function(){
        cc.log("game over");
    },

    nextLevel: function(){
        cc.log("next level");
        this.currentLevel ++;
        if(this.currentLevel == MAX_LEVEL){
            youWin();
        }
    },

    youWin: function(){
        cc.log("you win");
    }
});

GameDataMgr.gameDataMgrInstance = null;
GameDataMgr.createInstance = function(){
    if(GameDataMgr.gameDataMgrInstance == null){
        GameDataMgr.gameDataMgrInstance = new GameDataMgr();
    }

    return GameDataMgr.gameDataMgrInstance;
};