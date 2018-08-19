/**Created by thaod on 7/29/2018.*/

var MessageDialog = BasePopupDialog.extend({
    callBackFunc: null,
    acceptCallBack: null,

    acceptButton: null,
    cancelButton: null,
    acceptLabel: null,
    cancelLabel: null,

    bgImage: null,

    messageLabel: null,
    titleLabel: null,

    ctor: function(){
        cc.log("new message dialog");
        this._super();
        var layer = ccs.load(res.MessageDialog_json);
        this.addChild(layer.node);
        this.bgImage = layer.node.getChildByName("bgImage");
        var bgImage = this.bgImage;
        //var bgTitle = bgImage.getChildByName("bg_title");
        //
        //this.titleLabel = bgTitle.getChildByName("lb_title");
        var messageLabel = bgImage.getChildByName("bg_message").getChildByName("lb_message");
        var bgMessage = bgImage.getChildByName("bg_message");
        messageLabel.setString("");

        this.acceptButton = bgImage.getChildByName("btn_accept");
        this.acceptButton.addTouchEventListener(this.onAcceptClick, this);
        this.cancelButton = bgImage.getChildByName("btn_cancel");
        this.cancelButton.addTouchEventListener(this.onCancelClick, this);

        this.acceptLabel = this.acceptButton.getChildByName("lb_accept");
        this.cancelLabel = this.cancelButton.getChildByName("lb_cancel");

        this.messageLabel = new cc.LabelBMFont("", res.FONT_BRL_48, bgMessage.getContentSize().width *90/100, cc.TEXT_ALIGNMENT_CENTER);
        messageLabel.getParent().addChild(this.messageLabel);

        this.messageLabel.setPosition(messageLabel.getPosition());
    },

    startDialog: function(acceptCallBack, callBackFunc, message){
        this.setAcceptCallBack(acceptCallBack);
        this.setCallBackFunc(callBackFunc);

        //this.titleLabel.setString(title);
        this.messageLabel.setString(message);

        if(this.getParent() != null) return;
        ScreenMgr.getInstance().currentScreen.addChild(this, LAYER_DIALOG);
    },

    _removeFromParent: function(){
        //if(this.callBackFunc != null){
        //    this.callBackFunc.execute();
        //    this.callBackFunc.release();
        //}
        this._super();
    },

    setAcceptLabel: function(acceptStr){
        this.acceptLabel.setString(acceptStr);
    },

    setCancelLabel: function(cancelStr){
        this.cancelLabel.setString(cancelStr);
    },

    setCallBackFunc: function(callBackFunc){
        this.callBackFunc = callBackFunc;
        if(this.callBackFunc != null) this.callBackFunc.retain();
    },

    setAcceptCallBack: function(acceptCallBack){
        this.acceptCallBack = acceptCallBack;
        if(this.acceptCallBack != null) this.acceptCallBack.retain();
    },

    onAcceptClick: function(sender, controlEvent){
        cc.log("onAcceptClick");
        Utility.setScaleWhenTouchButton(sender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();

            if(this.acceptCallBack != null){
                this.acceptCallBack.execute();
            } else {
                cc.log("acceptCallBack = null");
            }

            this.closeDialog();
        }
    },

    onCancelClick: function(sender, controlEvent){
        Utility.setScaleWhenTouchButton(sender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();
            if(this.callBackFunc != null){
                this.callBackFunc.execute();
                this.callBackFunc.release();
            }
            this.closeDialog();
        }
    }

});

MessageDialog.messageDialogInstance = null;

MessageDialog.getInstance = function(){
    if(MessageDialog.messageDialogInstance == null){
        MessageDialog.messageDialogInstance = new MessageDialog();
        MessageDialog.messageDialogInstance.retain();
    }
    return MessageDialog.messageDialogInstance;
};

MessageDialog.destroyInstance = function(){
    if(MessageDialog.messageDialogInstance != null){
        MessageDialog.messageDialogInstance.release();
        MessageDialog.messageDialogInstance = null;
    }
};
