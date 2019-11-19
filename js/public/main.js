/*global variables 

*/
var ctx = null;
var ctx_hp = null;
var tileW = 40, tileH = 40;
var mapW = 60, mapH = 60;


var currentSecond= 0, frameCount = 0, framesLastSecond = 0;
var lastFrameTime = 0;

var tileset = null, tilesetURL = "tileset.png", tilesetLoaded = false;


//This variable distinguishes different types of tile so that it can be used to make for a more dynamic map with obstacles
var floorTypes = {
    solid : 0,
    path : 1,
    water : 2,
    lava  : 3
}

//the below variable stores all of the different types of tiles and assigns them a sprite from tileset.png
var tileTypes = {
    0 : { colour:"#999999", floor:floorTypes.solid, sprite:[{x:200, y:200, w:40, h:40}]},
    1 : { colour:"#eeeeee", floor:floorTypes.path, sprite:[{x:0, y:0, w:40, h:40}]},
    2 : { colour:"#0B99F7", floor:floorTypes.path, sprite:[{x:40, y:0, w:40, h:40}]},
    3 : { colour:"#0B99F7", floor:floorTypes.water, sprite:[{x:80, y:0, w:40, h:40}]},
    4 : { colour:"#0B99F7", floor:floorTypes.path, sprite:[{x:120, y:0, w:40, h:40}]},
    5 : { colour:"#0B99F7", floor:floorTypes.lava, sprite:[{x:160, y:0, w:40, h:40}]},


}


//this variable stores two directions to allow for different sprites depending on which direction the character is facing
var directions = {
    right  : 0,
    left   : 1,
    up     : 2,
    down   : 3
}


//the below variable assigns each key that will be used (WASD) a false value so that when the key is pressed they can be assigned true
var keysDown = {
    87 : false,
    65 : false,
    83 : false,
    68 : false
}


//the below variable stores all of the tiles that are used to create the map that the players traverses
var gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 4, 4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 1, 0,
	0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 5, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 5, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 0,
   	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];


//the below variable controls the screen that follows the character around the map
var viewport = {
        screen      :[0,0],
        startTile   :[0,0],
        endTile     :[0,0],
        offset      :[0,0],
        update      :function(px, py)
        {
            this.offset[0] = Math.floor((this.screen[0]/2) - px);
            this.offset[1] = Math.floor((this.screen[1]/2) - py);

            var tile = [
                Math.floor(px/tileW),
                Math.floor(py/tileH)
            ]
            this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
            this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);

            if (this.startTile[0] < 0) {this.startTile[0] = 0;} 
            if (this.startTile[1] < 0) {this.startTile[1] = 0;}

            this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
            this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

            if(this.endTile[0] >= mapW) {this.endTile[0] = mapW - 1;}
            if(this.endTile[1] >= mapW) {this.endTile[1] = mapW - 1;}
        }
}





//returns what the current tile's index
function toIndex(x, y)
{
    return ((y * mapW) + x);
}



//drawing the crabs onto the canvas
var crabReady = false;
var crabImage = new Image();
crabImage.onload = function () {
crabReady = true;
};



//Creates the crab object which will hold all of the sprite's information
function crabObject()
{
    this.tileFrom   = [9,1];
    this.tileTo     = [9,1];
    this.thisMoved  = 0;
    this.dimensions = [25, 25];
    this.position   = [360, 40];
    this.delayMove  = 250;
}


//creates instances of the crab object
var crab = new crabObject();
var crab1 = new crabObject();
var crab2 = new crabObject();
var crab3 = new crabObject();
var crab4 = new crabObject();
var crab5 = new crabObject();
var crab6 = new crabObject();






//Creates the character object that will hold all of the player's information
function Character()
{
    this.tileFrom   = [1,1];
    this.tileTo     = [1,1];
    this.thisMoved  = 0;
    this.dimensions = [35, 35];
    this.position   = [40, 40];
    this.hp = 100;

    this.delayMove = {}
    this.delayMove[floorTypes.path]  = 120;
    this.delayMove[floorTypes.water] = 200;
    this.delayMove[floorTypes.lava] = 200;

    this.direction  = directions.right;

    this.sprites    = {};
    this.sprites[directions.right] = [{x:0, y:205, w:35, h:35}];
    this.sprites[directions.left]  = [{x:35, y:205, w:35, h:35}];
    this.sprites[directions.up]    = [{x:35, y:170, w:35, h:35}];
    this.sprites[directions.down]  = [{x:0, y:170, w:35, h:35}];;

}

//creates an instance of the character object
var player = new Character();

//Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}


//THE BELOW FUNCTIONS PLACE THE SPRITE AT THE DESIRED SPAWN POINT##############################################
//#############################################################################################################
Character.prototype.placeAt = function(x, y)
{
    this.tileFrom   = [x,y];
    this.tileTo     = [x,y];
    this.position   = [((tileW*x) + ((tileW-this.dimensions[0])/2)), ((tileH*y) + ((tileH-this.dimensions[1])/2))];
}

crabObject.prototype.placeAt = function(x, y)
{
    this.tileFrom   = [x,y];
    this.tileTo     = [x,y];
    this.position   = [((tileW*x) + ((tileW-this.dimensions[0])/2)), ((tileH*y) + ((tileH-this.dimensions[1])/2))];
}


//THE BELOW FUNCTIONS MOVE THE SPRITE TO THE CORRECT TILE,#######################################################
// DETERMINES IT'S MOVEMENT SPEED AND PLACES IT IN THE MIDDLE OF THE TILE #######################################
Character.prototype.processMovement = function(t)
{

    if(this.tileFrom[0]==this.tileTo[0] &&
    this.tileFrom[1]==this.tileTo[1])
    {
        return false;
    }

    var moveSpeed = this.delayMove[tileTypes[gameMap[toIndex(this.tileFrom[0], this.tileFrom[1])]].floor];

    if((t-this.timeMoved) >= moveSpeed)
    {
        this.placeAt(this.tileTo[0], this.tileTo[1]);
    }
    else{
        this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0])/2);
        this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1])/2);

        if(this.tileTo[0] != this.tileFrom[0])
            {
                var diff = (tileW / moveSpeed) * (t - this.timeMoved);
                this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
            }
            if(this.tileTo[1] != this.tileFrom[1])
            {
                var diff = (tileH / moveSpeed) * (t - this.timeMoved);
                this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
            }

            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
    }
    
    return true;
}


crabObject.prototype.processMovement = function(t)
{

    if(this.tileFrom[0]==this.tileTo[0] &&
    this.tileFrom[1]==this.tileTo[1])
    {
        return false;
    }

    if((t-this.timeMoved) >= this.delayMove)
    {
        this.placeAt(this.tileTo[0], this.tileTo[1]);
    }
    else{
        this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0])/2);
        this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1])/2);

        if(this.tileTo[0] != this.tileFrom[0])
            {
                var diff = (tileW / this.delayMove) * (t - this.timeMoved);
                this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
            }
            if(this.tileTo[1] != this.tileFrom[1])
            {
                var diff = (tileH / this.delayMove) * (t - this.timeMoved);
                this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
            }

            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
    }
    
    return true;
}


//THE BELOW FUNCTIONS DETERMINE WHETHER OR NOT###############################################################
//THE SPRITES IN QUESTION ARE ABLE TO MOVE TO THE NEXT BLOCK OR NOT##########################################
Character.prototype.canMoveTo = function(x, y) 
{
    if(x < 0 || x>= mapW || y < 0 || y >= mapH) {return false;}
    if(typeof this.delayMove[tileTypes[gameMap[toIndex(x,y)]].floor] == 'undefined') {return false;}
    return true;
}



crabObject.prototype.canMoveTo = function(x, y) 
{
    if(x < 0 || x>= mapW || y < 0 || y >= mapH) {return false;}
    if(tileTypes[gameMap[toIndex(x,y)]].floor==floorTypes.sand || tileTypes[gameMap[toIndex(x,y)]].floor==floorTypes.water) {return true;}
    else if(tileTypes[gameMap[toIndex(x,y)]].floor==floorTypes.path || tileTypes[gameMap[toIndex(x,y)]].floor==floorTypes.solid){return false;}
}



//########################################SPRITE############################################################
//#######################################MOVEMENT###########################################################
//##########################################################################################################
Character.prototype.canMoveUp       = function() {return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);}
Character.prototype.canMoveDown     = function() {return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 2);}
Character.prototype.canMoveLeft     = function() {return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);}
Character.prototype.canMoveRight    = function() {return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);}


Character.prototype.moveLeft        = function(t) {this.tileTo[0]-=1; this.timeMoved = t; this.direction = directions.left;}
Character.prototype.moveRight       = function(t) {this.tileTo[0]+=1; this.timeMoved = t; this.direction = directions.right;}
Character.prototype.moveUp          = function(t) {this.tileTo[1]-=1; this.timeMoved = t; this.direction = directions.up;}
Character.prototype.moveDown        = function(t) {this.tileTo[1]+=1; this.timeMoved = t; this.direction = directions.down;}


crabObject.prototype.canMoveUp       = function() {return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);}
crabObject.prototype.canMoveDown     = function() {return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);}
crabObject.prototype.canMoveLeft     = function() {return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);}
crabObject.prototype.canMoveRight    = function() {return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);}


crabObject.prototype.moveLeft        = function(t) {this.tileTo[0]-=1; this.timeMoved = t;}
crabObject.prototype.moveRight       = function(t) {this.tileTo[0]+=1; this.timeMoved = t;}
crabObject.prototype.moveUp          = function(t) {this.tileTo[1]-=1; this.timeMoved = t;}
crabObject.prototype.moveDown        = function(t) {this.tileTo[1]+=1; this.timeMoved = t;}






//when the browser is loaded, do this
window.onload = function()
{
    //assigning the ctx variables to their respective canvases
    ctx = document.getElementById('map').getContext('2d');
    ctx_hp = document.getElementById('playerhp').getContext('2d');

    //tells the browser that upon loading, it must call this function to update the animation before the next repaint
    requestAnimationFrame(drawMap);

    //tells the browser that if any of the WASD keys are pressed, assign keysDown variable to true
    window.addEventListener("keydown", function(e){
        if(e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68)
        {
            keysDown[e.keyCode] = true;
        }
    })
    //tells the browser that if any of the WASD keys are pressed, assign keysDown variable to true
    window.addEventListener("keyup", function(e)
    {
        if(e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68)
        {
            keysDown[e.keyCode] = false;
        }
    })

    //storing the canvas "map"'s width and height in the viewports' screen paramater 
    viewport.screen = [
        document.getElementById('map').width,
        document.getElementById('map').height,
    ]

    tileset = new this.Image();

    //if for any reason the sprites cannot be loaded, the user will be alerted
    this.tileset.onerror = function(){
        ctx = null;
        alert("Failed to load sprites");
    }
    this.tileset.onload = function() { tilesetLoaded = true;}

    this.crabImage.onerror = function(){
        ctx = null;
        alert("Failed to load sprites");
    }
    this.crabImage.onload = function() { tilesetLoaded = true;}


    //assigning sprites their images
    this.tileset.src = tilesetURL;
    this.crabImage.src = "enemyCrab.png";


}


//creates the hp canvas and gives it the player's current hp
Character.prototype.gethp = function(){return this.hp}
Character.prototype.sethp = function(v){this.hp = v;drawHp()}
function drawHp()
{
    if (ctx_hp == null){return;}
    ctx_hp.clearRect(0,0,6000,200);
    ctx_hp.fillStyle = "#00FF00";
    ctx_hp.fillRect(0,0,(player.gethp()*6),10)
    
}





/*#################################DRAW#########################################
#################################FUNCTIONS######################################
################################################################################
*/
function drawMap()
{

    if (ctx==null) {return;}
    if (tileTypes[gameMap[toIndex(player.tileFrom[0],player.tileFrom[1])]].floor == 2)
    {
        player.sethp(player.gethp()-1);
        console.log("a");
        console.log(player.gethp());
    }
   
    if(!tilesetLoaded) { requestAnimationFrame(drawMap); return;}

    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;
    drawHp();
    

    var sec = Math.floor(Date.now()/1000);
    if(sec!=currentSecond)
    {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else {frameCount++;}



/*######################MOVEMENT###############################
#######################DIRECTION###############################
#######################VARIABLES###############################
*/




    var crabMovement = Math.floor((Math.random() * 4) + 1);
    var crab1Movement = Math.floor((Math.random() * 4) + 1);
    var crab2Movement = Math.floor((Math.random() * 4) + 1);
    var crab3Movement = Math.floor((Math.random() * 4) + 1);
    var crab4Movement = Math.floor((Math.random() * 4) + 1);
    var crab5Movement = Math.floor((Math.random() * 4) + 1);
    var crab6Movement = Math.floor((Math.random() * 4) + 1);




    //the below if loops determine whether or not the respective entity can move in the direction desired
    //and if it can, move it to the desired tile
    if(!player.processMovement(currentFrameTime))
    {
        console.log(tileTypes[gameMap[toIndex(player.tileFrom[0],player.tileFrom[1])]].floor)
        if(keysDown[87] && player.canMoveUp())
        {
            player.moveUp(currentFrameTime);
        }
        else  if(keysDown[83] && player.canMoveDown())
        {
            player.moveDown(currentFrameTime);
        }
        else if(keysDown[65] && player.canMoveLeft())
        {
            player.moveLeft(currentFrameTime);
        }
        else if(keysDown[68] && player.canMoveRight())
        {
            player.moveRight(currentFrameTime);
        }
        if(player.tileFrom[0]!=player.tileTo[0] || player.tileFrom[1]!=player.tileTo[1])
        {
            player.timeMoved = currentFrameTime;
        }
    }

    if(!crab.processMovement(currentFrameTime))
    {
        if(crabMovement == 1 && crab.canMoveUp())
        {
            crab.moveUp(currentFrameTime);
        }
        else  if(crabMovement == 2 && crab.canMoveDown())
        {
            crab.moveDown(currentFrameTime);
        }
        else if(crabMovement == 3 && crab.canMoveLeft())
        {
            crab.moveLeft(currentFrameTime);
        }
        else if(crabMovement == 4 && crab.canMoveRight())
        {
            crab.moveRight(currentFrameTime);
        }
        if(crab.tileFrom[0]!=crab.tileTo[0] || crab.tileFrom[1]!=crab.tileTo[1])
        {
            crab.timeMoved = currentFrameTime;
        }
    }

    if(!crab1.processMovement(currentFrameTime))
    {
        if(crab1Movement == 1 && crab1.canMoveUp())
        {
            crab1.moveUp(currentFrameTime);
        }
        else  if(crab1Movement == 2 && crab1.canMoveDown())
        {
            crab1.moveDown(currentFrameTime);
        }
        else if(crab1Movement == 3 && crab1.canMoveLeft())
        {
            crab1.moveLeft(currentFrameTime);
        }
        else if(crab1Movement == 4 && crab1.canMoveRight())
        {
            crab1.moveRight(currentFrameTime);
        }
        if(crab1.tileFrom[0]!=crab1.tileTo[0] || crab1.tileFrom[1]!=crab1.tileTo[1])
        {
            crab1.timeMoved = currentFrameTime;
        }
    }

    if(!crab2.processMovement(currentFrameTime))
    {
        if(crab2Movement == 1 && crab2.canMoveUp())
        {
            crab2.moveUp(currentFrameTime);
        }
        else  if(crab2Movement == 2 && crab2.canMoveDown())
        {
            crab2.moveDown(currentFrameTime);
        }
        else if(crab2Movement == 3 && crab2.canMoveLeft())
        {
            crab2.moveLeft(currentFrameTime);
        }
        else if(crab2Movement == 4 && crab2.canMoveRight())
        {
            crab2.moveRight(currentFrameTime);
        }
        if(crab2.tileFrom[0]!=crab2.tileTo[0] || crab2.tileFrom[1]!=crab2.tileTo[1])
        {
            crab2.timeMoved = currentFrameTime;
        }
    }

    if(!crab3.processMovement(currentFrameTime))
    {
        if(crab3Movement == 1 && crab3.canMoveUp())
        {
            crab3.moveUp(currentFrameTime);
        }
        else  if(crab3Movement == 2 && crab3.canMoveDown())
        {
            crab3.moveDown(currentFrameTime);
        }
        else if(crab3Movement == 3 && crab3.canMoveLeft())
        {
            crab3.moveLeft(currentFrameTime);
        }
        else if(crab3Movement == 4 && crab3.canMoveRight())
        {
            crab3.moveRight(currentFrameTime);
        }
        if(crab3.tileFrom[0]!=crab3.tileTo[0] || crab3.tileFrom[1]!=crab3.tileTo[1])
        {
            crab3.timeMoved = currentFrameTime;
        }
    }

    if(!crab4.processMovement(currentFrameTime))
    {
        if(crab4Movement == 1 && crab4.canMoveUp())
        {
            crab4.moveUp(currentFrameTime);
        }
        else  if(crab4Movement == 2 && crab4.canMoveDown())
        {
            crab4.moveDown(currentFrameTime);
        }
        else if(crab4Movement == 3 && crab4.canMoveLeft())
        {
            crab4.moveLeft(currentFrameTime);
        }
        else if(crab4Movement == 4 && crab4.canMoveRight())
        {
            crab4.moveRight(currentFrameTime);
        }
        if(crab4.tileFrom[0]!=crab4.tileTo[0] || crab4.tileFrom[1]!=crab4.tileTo[1])
        {
            crab4.timeMoved = currentFrameTime;
        }
    }

    if(!crab5.processMovement(currentFrameTime))
    {
        if(crab5Movement == 1 && crab5.canMoveUp())
        {
            crab5.moveUp(currentFrameTime);
        }
        else  if(crab5Movement == 2 && crab5.canMoveDown())
        {
            crab5.moveDown(currentFrameTime);
        }
        else if(crab5Movement == 3 && crab5.canMoveLeft())
        {
            crab5.moveLeft(currentFrameTime);
        }
        else if(crab5Movement == 4 && crab5.canMoveRight())
        {
            crab5.moveRight(currentFrameTime);
        }
        if(crab5.tileFrom[0]!=crab5.tileTo[0] || crab5.tileFrom[1]!=crab5.tileTo[1])
        {
            crab5.timeMoved = currentFrameTime;
        }
    }

    if(!crab6.processMovement(currentFrameTime))
    {
        if(crab6Movement == 1 && crab6.canMoveUp())
        {
            crab6.moveUp(currentFrameTime);
        }
        else  if(crab6Movement == 2 && crab6.canMoveDown())
        {
            crab6.moveDown(currentFrameTime);
        }
        else if(crab6Movement == 3 && crab6.canMoveLeft())
        {
            crab6.moveLeft(currentFrameTime);
        }
        else if(crab6Movement == 4 && crab6.canMoveRight())
        {
            crab6.moveRight(currentFrameTime);
        }
        if(crab6.tileFrom[0]!=crab6.tileTo[0] || crab6.tileFrom[1]!=crab6.tileTo[1])
        {
            crab6.timeMoved = currentFrameTime;
        }
    }

    
    //Places the player in the middle of the tile
    viewport.update(
        player.position[0] + (player.dimensions[0]/2),
        player.position[1] + (player.dimensions[1]/2),
    )

    //Drawing the map
    ctx.fillStyle = "#999999";
    ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

    for(var y = viewport.startTile[1]; y < viewport.endTile[1]; y++)
    {
        for(var x = viewport.startTile[0]; x < viewport.endTile[0]; x++)
        {
            var tile = tileTypes[gameMap[toIndex(x,y)]];
            ctx.drawImage(tileset, tile.sprite[0].x, tile.sprite[0].y, tile.sprite[0].w, tile.sprite[0].h, viewport.offset[0] + (x*tileW), viewport.offset[1] + (y*tileH), tileW, tileH)
        }
    }




    /*###################################SPRITE##########################################
    ######################################DRAW###########################################
    ####################################FUNCTIONS########################################
    */
    var sprite = player.sprites[player.direction];
    ctx.drawImage(tileset, sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h, viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1], player.dimensions[0], player.dimensions[1]);
    
    ctx.drawImage(crabImage, viewport.offset[0] + crab.position[0], viewport.offset[1] + crab.position[1]);
    ctx.drawImage(crabImage, viewport.offset[0] + crab1.position[0], viewport.offset[1] + crab1.position[1]);
    ctx.drawImage(crabImage, viewport.offset[0] + crab2.position[0], viewport.offset[1] + crab2.position[1]);
    ctx.drawImage(crabImage, viewport.offset[0] + crab3.position[0], viewport.offset[1] + crab3.position[1]);
    ctx.drawImage(crabImage, viewport.offset[0] + crab4.position[0], viewport.offset[1] + crab4.position[1]);
    ctx.drawImage(crabImage, viewport.offset[0] + crab5.position[0], viewport.offset[1] + crab5.position[1]);
    ctx.drawImage(crabImage, viewport.offset[0] + crab6.position[0], viewport.offset[1] + crab6.position[1]);






    //telling the browser to update the animation with this function before the next paint
    requestAnimationFrame(drawMap);
}

