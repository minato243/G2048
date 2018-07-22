var res = {
    MenuScene_json: "res/MenuScene.json",
    PlayScene_json: "res/PlayScene.json",
    StartDialog_json:"res/StartDialog.json",

    iconImage: {type: "image", src: "res/menu_scene.png"},
    iconPlist: {type: "plist", src: "res/menu_scene.plist"},
    menuImage: {type: "image", src: "res/play_scene.png"},
    menuPlist: {type: "plist", src: "res/play_scene.plist"},

    noMoveSound: "res/sound/No.mp3",
    rightSound: "res/sound/pair.mp3",
    bgMusic: "res/sound/music_bg.mp3",
    levelSound: "res/sound/pika_win.mp3",

    BM_FONT:"res/TimeNewRoman.fnt"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
};
