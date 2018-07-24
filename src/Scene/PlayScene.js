/**
 * Created by thaod on 6/24/2018.
 * MenuScene
 */

var PlayScene = cc.Scene.extend({
    playLayer: null,

    ctor: function(){
        this._super();
        this.playLayer = null;

        this.playLayer = new PlaySceneLayer();
        this.addChild(this.playLayer);
    },

    onEnter:function () {
        this._super();

    },

});

PlayScene.playSceneInstance = null;
PlayScene.getInstance = function(){
    if(PlayScene.playSceneInstance == null){
        PlayScene.playSceneInstance = new PlayScene();
        PlayScene.playSceneInstance.retain();
    }
    return PlayScene.playSceneInstance;
};