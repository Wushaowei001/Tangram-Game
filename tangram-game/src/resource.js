var res = {
    HelloWorld_png : "res/HelloWorld.png",
    Board_png : "res/Board.png",
    PlaceBoard_png: "res/PlaceBoard.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    Youwin_png : "res/You-Win.png",	
    Piece1_png: "res/simpleblock4.png",
    Piece2_png: "res/piece2.png",
    Piece3_png: "res/simpleblock2.png",
    Piece4_png: "res/simpleblock3.png",
    Background_png: "res/background.png",
    GameBackground_png: "res/gamebackground.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}