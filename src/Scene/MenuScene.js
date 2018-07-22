
/**
 * Created by thaod on 6/20/2018.
 * MenuScene
 */

var MenuScene = cc.Scene.extend({
    menuLayer: null,

    ctor: function(){
        this._super();
        this.menuLayer = null;
        GameDataMgr.createInstance();
    },

    onEnter:function () {
        this._super();
        this.menuLayer = new MenuSceneLayer();
        this.addChild(this.menuLayer);
    }
});
