//the canvas variables
var ctx = null;
var ctx_hp = null;
//the width of each tile in pixels
var tileW = 40,
	tileH = 40;
//the width of the map in tiles
var mapW = 60,
	mapH = 60;

var currentSecond = 0,
	frameCount = 0,
	framesLastSecond = 0;
var lastFrameTime = 0;

//sets the variables characterType whatever was stored in cTypeLocalStorage
var characterType = localStorage.getItem("cTypeLocalStorage");
/*var playx = localStorage.getItem("posxLocalStorage");
var playy = localStorage.getItem("posyLocalStorage");
*/

//This variable distinguishes different types of tile so that it can be used to make for a more dynamic map with obstacles
var floorTypes = {
	solid: 0,
	path: 1,
	water: 2,
	lava: 3,
	sand: 4,
	darkPath: 5
};

//the below variable stores all of the different types of tiles and assigns them a sprite from tileset.png
var tileTypes = {
	0: { colour: "#999999", floor: floorTypes.solid, sprite: [{ x: 200, y: 200, w: 40, h: 40 }] },
	1: { colour: "#eeeeee", floor: floorTypes.path, sprite: [{ x: 0, y: 0, w: 40, h: 40 }] },
	2: { colour: "#0B99F7", floor: floorTypes.sand, sprite: [{ x: 40, y: 0, w: 40, h: 40 }] },
	3: { colour: "#0B99F7", floor: floorTypes.water, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },
	4: { colour: "#0B99F7", floor: floorTypes.darkPath, sprite: [{ x: 120, y: 0, w: 40, h: 40 }] },
	5: { colour: "#0B99F7", floor: floorTypes.lava, sprite: [{ x: 160, y: 0, w: 40, h: 40 }] }
};

//this variable stores two directions to allow for different sprites depending on which direction the character is facing
var directions = {
	right: 0,
	left: 1,
	up: 2,
	down: 3
};

//the below variable assigns each key that will be used (WASD) a false value so that when the key is pressed they can be assigned true
var keysDown = {
	87: false,
	65: false,
	83: false,
	68: false
};

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
	0, 1, 1, 2, 2, 1, 3, 3, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 2, 2, 1, 3, 3, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 5, 5, 1, 4, 4, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 5, 5, 1, 4, 4, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
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

var occupiedGrid = [];

for (i = 0; i < gameMap.length; i++) {
	occupiedGrid.push(false);
}

//Creates Item types
var itemTypes = {
	1 : {
		name : "Health",
		maxStack : 4,
		sprite : "\assets\images\items\healthpot.png",
		offset : [0,0]
	}
};
//For Stacks of Items
function Stack(id, qty)
{
	this.type = id;
	this.qty = qty;
}
//Inventory Space
function Inventory(s)
{
	this.spaces		= s;
	this.stacks		= [];
}
//Adds Items to Inventory
Inventory.prototype.addItems = function(id, qty)
{
	for(var i = 0; i < this.spaces; i++)
	{
		if(this.stacks.length<=i)
		{
			var maxHere = (qty > itemTypes[id].maxStack ?
				itemTypes[id].maxStack : qty);
			this.stacks.push(new Stack(id, maxHere));
			
			qty-= maxHere;
		}
		else if(this.stacks[i].type == id &&
			this.stacks[i].qty < itemTypes[id].maxStack)
		{
			var maxHere = (itemTypes[id].maxStack - this.stacks[i].qty);
			if(maxHere > qty) { maxHere = qty; }
			
			this.stacks[i].qty+= maxHere;
			qty-= maxHere;
		}
		
		if(qty==0) { return 0; }
	}
	
	return qty;
};

//Dropped Stacks Of Items On Ground
function PlacedItemStack(id, qty)
{
	this.type = id;
	this.qty = qty;
	this.x = 0;
    this.dimensions = [25, 25];
	this.y = 0;
}
//Places Items At Location
PlacedItemStack.prototype.placeAt = function(x, y)
{
	this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
};

//the below variable controls the screen that follows the character around the map
var viewport = {
	screen: [0, 0],
	startTile: [0, 0],
	endTile: [0, 0],
	offset: [0, 0],
	update: function(px, py) {
		this.offset[0] = Math.floor(this.screen[0] / 2 - px);
		this.offset[1] = Math.floor(this.screen[1] / 2 - py);

		var tile = [Math.floor(px / tileW), Math.floor(py / tileH)];

		this.startTile[0] = tile[0] - 1 - Math.ceil(this.screen[0] / 2 / tileW);
		this.startTile[1] = tile[1] - 1 - Math.ceil(this.screen[1] / 2 / tileH);

		if (this.startTile[0] < 0) {
			this.startTile[0] = 0;
		}
		if (this.startTile[1] < 0) {
			this.startTile[1] = 0;
		}

		this.endTile[0] = tile[0] + 1 + Math.ceil(this.screen[0] / 2 / tileW);
		this.endTile[1] = tile[1] + 1 + Math.ceil(this.screen[1] / 2 / tileH);

		if (this.endTile[0] >= mapW) {
			this.endTile[0] = mapW - 1;
		}
		if (this.endTile[1] >= mapW) {
			this.endTile[1] = mapW - 1;
		}
	}
};

//returns what the current tile's index
function toIndex(x, y) {
	return y * mapW + x;
}

//the variables associated with map and player sprites
var tilesetLoaded = false;
var tileset = new this.Image();

//creating the variables necessary to load the sprites onto the enemies
var crabReady = false;
var crabImage = new Image();
var lvl2crabReady = false;
var lvl2crabImage = new Image();
var lvl3crabReady = false;
var lvl3crabImage = new Image();

var darkSquidReady = false;
var darkSquidImage = new Image();

//Creates the crab object which will hold all of the sprite's information
class crabObject {
	constructor() {
		this.tileFrom = [17, 8];
		this.tileTo = [17, 8];
		this.thisMoved = 0;
		this.dimensions = [25, 25];
		this.position = [680, 320];
		this.delayMove = 300;
		this.hp = 40;
	}
	placeAt(x, y) {
		this.tileFrom = [x, y];
		this.tileTo = [x, y];
		this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
	}
	processMovement(t) {
		if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) {
			return false;
		}
		if (t - this.timeMoved >= this.delayMove) {
			this.placeAt(this.tileTo[0], this.tileTo[1]);
		} else {
			this.position[0] = this.tileFrom[0] * tileW + (tileW - this.dimensions[0]) / 2;
			this.position[1] = this.tileFrom[1] * tileH + (tileH - this.dimensions[1]) / 2;
			if (this.tileTo[0] != this.tileFrom[0]) {
				var diff = (tileW / this.delayMove) * (t - this.timeMoved);
				this.position[0] += this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff;
			}
			if (this.tileTo[1] != this.tileFrom[1]) {
				var diff = (tileH / this.delayMove) * (t - this.timeMoved);
				this.position[1] += this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff;
			}
			this.position[0] = Math.round(this.position[0]);
			this.position[1] = Math.round(this.position[1]);
		}
		return true;
	}
	canMoveTo(x, y) {
		//makes sure it can't move off map
		if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
			return false;
		}
		if (isOccupied(toIndex(x, y))) {
			return false;
		}
		if (tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.sand || tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.water) {
			return true;
		} else {
			return false;
		}
	}
	canMoveUp() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
	}
	canMoveDown() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
	}
	canMoveLeft() {
		return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
	}
	canMoveRight() {
		return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
	}
	moveLeft(t) {
		this.tileTo[0] -= 1;
		this.timeMoved = t;
	}
	moveRight(t) {
		this.tileTo[0] += 1;
		this.timeMoved = t;
	}
	moveUp(t) {
		this.tileTo[1] -= 1;
		this.timeMoved = t;
	}
	moveDown(t) {
		this.tileTo[1] += 1;
		this.timeMoved = t;
	}
}

//creates instances of the crab object
var crab = [];
var crabCount = 6;
for (var i = 0; i < crabCount; i++) {
	crab[i] = new crabObject();
}

//Creates the level 2 crab object
class lvl2crabObject {
	constructor() {
		this.tileFrom = [13, 24];
		this.tileTo = [13, 24];
		this.thisMoved = 0;
		this.dimensions = [30, 30];
		this.position = [520, 960];
		this.delayMove = 400;
		this.hp = 80;
	}
	placeAt(x, y) {
		this.tileFrom = [x, y];
		this.tileTo = [x, y];
		this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
	}
	processMovement(t) {
		if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) {
			return false;
		}
		if (t - this.timeMoved >= this.delayMove) {
			this.placeAt(this.tileTo[0], this.tileTo[1]);
		} else {
			this.position[0] = this.tileFrom[0] * tileW + (tileW - this.dimensions[0]) / 2;
			this.position[1] = this.tileFrom[1] * tileH + (tileH - this.dimensions[1]) / 2;
			if (this.tileTo[0] != this.tileFrom[0]) {
				var diff = (tileW / this.delayMove) * (t - this.timeMoved);
				this.position[0] += this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff;
			}
			if (this.tileTo[1] != this.tileFrom[1]) {
				var diff = (tileH / this.delayMove) * (t - this.timeMoved);
				this.position[1] += this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff;
			}
			this.position[0] = Math.round(this.position[0]);
			this.position[1] = Math.round(this.position[1]);
		}
		return true;
	}
	canMoveTo(x, y) {
		if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
			return false;
		}
		if (isOccupied(toIndex(x, y))) {
			return false;
		}
		if (tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.sand || tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.water) {
			return true;
		} else {
			return false;
		}
	}
	canMoveUp() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
	}
	canMoveDown() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
	}
	canMoveLeft() {
		return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
	}
	canMoveRight() {
		return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
	}
	moveLeft(t) {
		this.tileTo[0] -= 1;
		this.timeMoved = t;
	}
	moveRight(t) {
		this.tileTo[0] += 1;
		this.timeMoved = t;
	}
	moveUp(t) {
		this.tileTo[1] -= 1;
		this.timeMoved = t;
	}
	moveDown(t) {
		this.tileTo[1] += 1;
		this.timeMoved = t;
	}
}

//creates instances of the lvl2crab object
var lvl2Crab = [];
for (i = 7; i < 20; i++) {
	lvl2Crab[i] = new lvl2crabObject();
}

//Creates the level 3 crab object
class lvl3crabObject {
	constructor() {
		this.tileFrom = [38, 26];
		this.tileTo = [38, 26];
		this.thisMoved = 0;
		this.dimensions = [40, 40];
		this.position = [1520, 1040];
		this.delayMove = 500;
		this.hp = 160;
	}
	placeAt(x, y) {
		this.tileFrom = [x, y];
		this.tileTo = [x, y];
		this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
	}
	processMovement(t) {
		if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) {
			return false;
		}
		if (t - this.timeMoved >= this.delayMove) {
			this.placeAt(this.tileTo[0], this.tileTo[1]);
		} else {
			this.position[0] = this.tileFrom[0] * tileW + (tileW - this.dimensions[0]) / 2;
			this.position[1] = this.tileFrom[1] * tileH + (tileH - this.dimensions[1]) / 2;
			if (this.tileTo[0] != this.tileFrom[0]) {
				var diff = (tileW / this.delayMove) * (t - this.timeMoved);
				this.position[0] += this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff;
			}
			if (this.tileTo[1] != this.tileFrom[1]) {
				var diff = (tileH / this.delayMove) * (t - this.timeMoved);
				this.position[1] += this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff;
			}
			this.position[0] = Math.round(this.position[0]);
			this.position[1] = Math.round(this.position[1]);
		}
		return true;
	}
	canMoveTo(x, y) {
		if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
			return false;
		}
		if (isOccupied(toIndex(x, y))) {
			return false;
		}
		if (tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.sand || tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.water) {
			return true;
		} else {
			return false;
		}
	}
	canMoveUp() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
	}
	canMoveDown() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
	}
	canMoveLeft() {
		return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
	}
	canMoveRight() {
		return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
	}
	moveLeft(t) {
		this.tileTo[0] -= 1;
		this.timeMoved = t;
	}
	moveRight(t) {
		this.tileTo[0] += 1;
		this.timeMoved = t;
	}
	moveUp(t) {
		this.tileTo[1] -= 1;
		this.timeMoved = t;
	}
	moveDown(t) {
		this.tileTo[1] += 1;
		this.timeMoved = t;
	}
}

//creates instances of the lvl3crab object
var lvl3Crab = [];
for (i = 21; i < 31; i++) {
	lvl3Crab[i] = new lvl3crabObject();
}

//Creates the level 2 crab object
class darkSquidObject {
	constructor() {
		this.tileFrom = [57, 57];
		this.tileTo = [57, 57];
		this.thisMoved = 0;
		this.dimensions = [33, 40];
		this.position = [2280, 2280];
		this.delayMove = 600;
		this.hp = 3000;
		this.direction = directions.left;
		this.sprites = {};
		this.sprites[directions.right] = [{ x: 33, y: 0, w: 33, h: 40 }];
		this.sprites[directions.left] = [{ x: 0, y: 0, w: 33, h: 40 }];
	}
	placeAt(x, y) {
		this.tileFrom = [x, y];
		this.tileTo = [x, y];
		this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
	}
	processMovement(t) {
		if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) {
			return false;
		}
		if (t - this.timeMoved >= this.delayMove) {
			this.placeAt(this.tileTo[0], this.tileTo[1]);
		} else {
			this.position[0] = this.tileFrom[0] * tileW + (tileW - this.dimensions[0]) / 2;
			this.position[1] = this.tileFrom[1] * tileH + (tileH - this.dimensions[1]) / 2;
			if (this.tileTo[0] != this.tileFrom[0]) {
				var diff = (tileW / this.delayMove) * (t - this.timeMoved);
				this.position[0] += this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff;
			}
			if (this.tileTo[1] != this.tileFrom[1]) {
				var diff = (tileH / this.delayMove) * (t - this.timeMoved);
				this.position[1] += this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff;
			}
			this.position[0] = Math.round(this.position[0]);
			this.position[1] = Math.round(this.position[1]);
		}
		return true;
	}
	canMoveTo(x, y) {
		if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
			return false;
		}
		if (isOccupied(toIndex(x, y))) {
			return false;
		}
		if (tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.darkPath || tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.lava) {
			return true;
		} else {
			return false;
		}
	}
	canMoveUp() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
	}
	canMoveDown() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 2);
	}
	canMoveLeft() {
		return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
	}
	canMoveRight() {
		return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
	}
	moveLeft(t) {
		this.tileTo[0] -= 1;
		this.timeMoved = t;
		this.direction = directions.left;
	}
	moveRight(t) {
		this.tileTo[0] += 1;
		this.timeMoved = t;
		this.direction = directions.right;
	}
	moveUp(t) {
		this.tileTo[1] -= 1;
		this.timeMoved = t;
	}
	moveDown(t) {
		this.tileTo[1] += 1;
		this.timeMoved = t;
	}
}

//creates instances of the lvl2crab object
darkSquid = new darkSquidObject();

//Creates the character object that will hold all of the player's information
class Character {
	constructor() {
		this.tileFrom = [1, 1];
		this.tileTo = [1, 1];
		this.thisMoved = 0;
		this.dimensions = [35, 35];
		this.position = [40, 40];
		this.hp = 100;
		this.delayMove = {};
		this.delayMove[floorTypes.path] = 120;
		this.delayMove[floorTypes.sand] = 120;
		this.delayMove[floorTypes.water] = 200;
		this.delayMove[floorTypes.lava] = 200;
		this.delayMove[floorTypes.darkPath] = 120;
		this.direction = directions.right;
		this.sprites = {};
		this.sprites[directions.right] = [{ x: 0, y: 205, w: 35, h: 35 }];
		this.sprites[directions.left] = [{ x: 35, y: 205, w: 35, h: 35 }];
		this.sprites[directions.up] = [{ x: 35, y: 170, w: 35, h: 35 }];
		this.sprites[directions.down] = [{ x: 0, y: 170, w: 35, h: 35 }];
        this.inventory = new Inventory(3);

	}
	//THE BELOW FUNCTIONS PLACE THE SPRITE AT THE DESIRED SPAWN POINT##############################################
	//#############################################################################################################
	placeAt(x, y) {
		this.tileFrom = [x, y];
		this.tileTo = [x, y];
		this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
	}
	//THE BELOW FUNCTIONS MOVE THE SPRITE TO THE CORRECT TILE,#######################################################
	// DETERMINES IT'S MOVEMENT SPEED AND PLACES IT IN THE MIDDLE OF THE TILE #######################################
	processMovement(t) {
		if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) {
			return false;
		}
		var moveSpeed = this.delayMove[tileTypes[gameMap[toIndex(this.tileFrom[0], this.tileFrom[1])]].floor];
		if (t - this.timeMoved >= moveSpeed) {
			this.placeAt(this.tileTo[0], this.tileTo[1]);
		} else {
			this.position[0] = this.tileFrom[0] * tileW + (tileW - this.dimensions[0]) / 2;
			this.position[1] = this.tileFrom[1] * tileH + (tileH - this.dimensions[1]) / 2;
			if (this.tileTo[0] != this.tileFrom[0]) {
				var diff = (tileW / moveSpeed) * (t - this.timeMoved);
				this.position[0] += this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff;
			}
			if (this.tileTo[1] != this.tileFrom[1]) {
				var diff = (tileH / moveSpeed) * (t - this.timeMoved);
				this.position[1] += this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff;
			}
			this.position[0] = Math.round(this.position[0]);
			this.position[1] = Math.round(this.position[1]);
		}
		return true;
	}
	//THE BELOW FUNCTIONS DETERMINE WHETHER OR NOT
	//THE SPRITES IN QUESTION ARE ABLE TO MOVE TO THE NEXT BLOCK OR NOT
	canMoveTo(x, y) {
		if (isOccupied(toIndex(x, y))) {
			return false;
		}
		if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
			return false;
		}
		if (typeof this.delayMove[tileTypes[gameMap[toIndex(x, y)]].floor] == "undefined") {
			return false;
		}
		return true;
	}
	gethp() {
		return this.hp;
	}
	sethp(v) {
		this.hp = v;
		drawHp();
	}
	respawn() {
		this.placeAt(1, 1);
		this.sethp(100);
	}
	//########################################SPRITE############################################################
	//#######################################MOVEMENT###########################################################
	//##########################################################################################################
	canMoveUp() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
	}
	canMoveDown() {
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 2);
	}
	canMoveLeft() {
		return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
	}
	canMoveRight() {
		return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
	}
	moveLeft(t) {
		this.tileTo[0] -= 1;
		this.timeMoved = t;
		this.direction = directions.left;
	}
	moveRight(t) {
		this.tileTo[0] += 1;
		this.timeMoved = t;
		this.direction = directions.right;
	}
	moveUp(t) {
		this.tileTo[1] -= 1;
		this.timeMoved = t;
		this.direction = directions.up;
	}
	moveDown(t) {
		this.tileTo[1] += 1;
		this.timeMoved = t;
		this.direction = directions.down;
	}
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
function isInside(pos, rect) {
	return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
}

function updateOccupied(square, truth) {
	occupiedGrid[square] = truth;
}

function isOccupied(square) {
	return occupiedGrid[square];
}

function getObject(index) {
	if (isOccupied(index)) {
		return;
	}
}

//when the browser is loaded, do this
window.onload = function() {
	//sends position of player to the server every 100 milliseconds
	window.setInterval(function() {
		getPosition();
	}, 100);
	//assigning the ctx variables to their respective canvases
	ctx = document.getElementById("map").getContext("2d");
	ctx_hp = document.getElementById("playerhp").getContext("2d");

	//tells the browser that upon loading, it must call this function to update the animation before the next repaint
	requestAnimationFrame(drawMap);

	//tells the browser that if any of the WASD keys are pressed, assign keysDown variable to true
	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68) {
			keysDown[e.keyCode] = true;
		}
	});
	//tells the browser that if any of the WASD keys are pressed, assign keysDown variable to true
	window.addEventListener("keyup", function(e) {
		if (e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68) {
			keysDown[e.keyCode] = false;
		}
	});

	//storing the canvas "map"'s width and height in the viewports' screen paramater
	viewport.screen = [document.getElementById("map").width, document.getElementById("map").height];

	//if for any reason the sprites cannot be loaded, the user will be alerted
	this.tileset.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.tileset.onload = function() {
		tilesetLoaded = true;
	};

	this.crabImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.crabImage.onload = function() {
		tilesetLoaded = true;
	};

	this.lvl2crabImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.lvl2crabImage.onload = function() {
		tilesetLoaded = true;
	};

	this.lvl3crabImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.lvl3crabImage.onload = function() {
		tilesetLoaded = true;
	};

	this.darkSquidImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.darkSquidImage.onload = function() {
		tilesetLoaded = true;
	};

	//assigning sprites their images
	if (characterType == "archer") {
		this.tileset.src = "assets/images/tileset.png";
	}
	if (characterType == "knight") {
		this.tileset.src = "assets/images/tilesetknight.png";
	}
	if (characterType == "mage") {
		this.tileset.src = "assets/images/tilesetmage.png";
	}
	this.crabImage.src = "assets/images/lvl1crab.png";
	this.lvl2crabImage.src = "assets/images/lvl2crab.png";
	this.lvl3crabImage.src = "assets/images/lvl3crab.png";
	this.darkSquidImage.src = "assets/images/squidboss.png";
    
    var ps = new PlacedItemStack(1, 1); ps.placeAt(i, 1);
};

//creates the hp canvas and gives it the player's current hp
function drawHp() {
	if (ctx_hp == null) {
		return;
	}
	ctx_hp.clearRect(0, 0, 6000, 200);
	ctx_hp.fillStyle = "#00FF00";
	ctx_hp.fillRect(0, 0, player.gethp() * 6, 10);
}

/*#################################DRAW#########################################
#################################FUNCTIONS######################################
################################################################################
*/
function drawMap() {
	if (ctx == null) {
		return;
	}
	if (tileTypes[gameMap[toIndex(player.tileFrom[0], player.tileFrom[1])]].floor == 3) {
		player.sethp(player.gethp() - 0.5);
	}
	if (player.gethp() <= 0) {
		player.respawn();
	}
	if (!tilesetLoaded) {
		requestAnimationFrame(drawMap);
		return;
	}
    
	var currentFrameTime = Date.now();
	var timeElapsed = currentFrameTime - lastFrameTime;
	drawHp();

	var sec = Math.floor(Date.now() / 1000);
	if (sec != currentSecond) {
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	} else {
		frameCount++;
	}

	//the below if loops determine whether or not the respective entity can move in the direction desired
	//and if it can, move it to the desired tile
	if (!player.processMovement(currentFrameTime)) {
		if (keysDown[87] && player.canMoveUp()) {
			player.moveUp(currentFrameTime);
		} else if (keysDown[83] && player.canMoveDown()) {
			player.moveDown(currentFrameTime);
		} else if (keysDown[65] && player.canMoveLeft()) {
			player.moveLeft(currentFrameTime);
		} else if (keysDown[68] && player.canMoveRight()) {
			player.moveRight(currentFrameTime);
		}
		if (player.tileFrom[0] != player.tileTo[0] || player.tileFrom[1] != player.tileTo[1]) {
			player.timeMoved = currentFrameTime;
		}
	}
	//Creates crabs and randomly moves them
	for (i = 0; i < crabCount; i++) {
		var crabMovement = Math.floor(Math.random() * 4 + 1);
		if (!crab[i].processMovement(currentFrameTime)) {
			if (crabMovement == 1 && crab[i].canMoveUp()) {
				crab[i].moveUp(currentFrameTime);
			} else if (crabMovement == 2 && crab[i].canMoveDown()) {
				crab[i].moveDown(currentFrameTime);
			} else if (crabMovement == 3 && crab[i].canMoveLeft()) {
				crab[i].moveLeft(currentFrameTime);
			} else if (crabMovement == 4 && crab[i].canMoveRight()) {
				crab[i].moveRight(currentFrameTime);
			}
			if (crab[i].tileFrom[0] != crab[i].tileTo[0] || crab[i].tileFrom[1] != crab[i].tileTo[1]) {
				crab[i].timeMoved = currentFrameTime;
			}
		}
	}

	for (i = 7; i < 20; i++) {
		crabMovement = Math.floor(Math.random() * 4 + 1);
		if (!lvl2Crab[i].processMovement(currentFrameTime)) {
			if (crabMovement == 1 && lvl2Crab[i].canMoveUp()) {
				lvl2Crab[i].moveUp(currentFrameTime);
			} else if (crabMovement == 2 && lvl2Crab[i].canMoveDown()) {
				lvl2Crab[i].moveDown(currentFrameTime);
			} else if (crabMovement == 3 && lvl2Crab[i].canMoveLeft()) {
				lvl2Crab[i].moveLeft(currentFrameTime);
			} else if (crabMovement == 4 && lvl2Crab[i].canMoveRight()) {
				lvl2Crab[i].moveRight(currentFrameTime);
			}
			if (lvl2Crab[i].tileFrom[0] != lvl2Crab[i].tileTo[0] || lvl2Crab[i].tileFrom[1] != lvl2Crab[i].tileTo[1]) {
				lvl2Crab[i].timeMoved = currentFrameTime;
			}
		}
	}

	for (i = 21; i < 31; i++) {
		crabMovement = Math.floor(Math.random() * 4 + 1);
		if (!lvl3Crab[i].processMovement(currentFrameTime)) {
			if (crabMovement == 1 && lvl3Crab[i].canMoveUp()) {
				lvl3Crab[i].moveUp(currentFrameTime);
			} else if (crabMovement == 2 && lvl3Crab[i].canMoveDown()) {
				lvl3Crab[i].moveDown(currentFrameTime);
			} else if (crabMovement == 3 && lvl3Crab[i].canMoveLeft()) {
				lvl3Crab[i].moveLeft(currentFrameTime);
			} else if (crabMovement == 4 && lvl3Crab[i].canMoveRight()) {
				lvl3Crab[i].moveRight(currentFrameTime);
			}
			if (lvl3Crab[i].tileFrom[0] != lvl3Crab[i].tileTo[0] || lvl3Crab[i].tileFrom[1] != lvl3Crab[i].tileTo[1]) {
				lvl3Crab[i].timeMoved = currentFrameTime;
			}
		}
	}

	if (!darkSquid.processMovement(currentFrameTime)) {
		var darkSquidMovement = Math.floor(Math.random() * 4 + 1);
		if (darkSquidMovement == 1 && darkSquid.canMoveUp()) {
			darkSquid.moveUp(currentFrameTime);
		} else if (darkSquidMovement == 2 && darkSquid.canMoveDown()) {
			darkSquid.moveDown(currentFrameTime);
		} else if (darkSquidMovement == 3 && darkSquid.canMoveLeft()) {
			darkSquid.moveLeft(currentFrameTime);
		} else if (darkSquidMovement == 4 && darkSquid.canMoveRight()) {
			darkSquid.moveRight(currentFrameTime);
		}
		if (darkSquid.tileFrom[0] != darkSquid.tileTo[0] || darkSquid.tileFrom[1] != darkSquid.tileTo[1]) {
			darkSquid.timeMoved = currentFrameTime;
		}
	}

	//Places the player in the middle of the tile
	viewport.update(player.position[0] + player.dimensions[0] / 2, player.position[1] + player.dimensions[1] / 2);

	//Drawing the map
	ctx.fillStyle = "#999999";
	ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

	for (var y = viewport.startTile[1]; y < viewport.endTile[1]; y++) {
		for (var x = viewport.startTile[0]; x < viewport.endTile[0]; x++) {
			var tile = tileTypes[gameMap[toIndex(x, y)]];
			ctx.drawImage(
				tileset,
				tile.sprite[0].x,
				tile.sprite[0].y,
				tile.sprite[0].w,
				tile.sprite[0].h,
				viewport.offset[0] + x * tileW,
				viewport.offset[1] + y * tileH,
				tileW,
				tileH
			);
		}
	}

	var allobj = [];
	for (var key in window) {
		var value = window[key];
		if (value instanceof Character || value instanceof crabObject || value instanceof lvl2crabObject) {
			allobj.push(toIndex(value.tileFrom[0], value.tileFrom[1]));
			allobj.push(toIndex(value.tileTo[0], value.tileTo[1]));
		}
	}

	for (i = 0; i < occupiedGrid.length; i++) {
		if (allobj.includes(i)) {
			updateOccupied(i, true);
		} else {
			updateOccupied(i, false);
		}
	}

	/*###################################SPRITE##########################################
    ######################################DRAW###########################################
    ####################################FUNCTIONS######################################*/
	var sprite = player.sprites[player.direction];
	ctx.drawImage(
		tileset,
		sprite[0].x,
		sprite[0].y,
		sprite[0].w,
		sprite[0].h,
		viewport.offset[0] + player.position[0],
		viewport.offset[1] + player.position[1],
		player.dimensions[0],
		player.dimensions[1]
	);
	for (i = 0; i < crabCount; i++) {
		ctx.drawImage(crabImage, viewport.offset[0] + crab[i].position[0], viewport.offset[1] + crab[i].position[1]);
	}
	for (i = 7; i < 20; i++) {
		ctx.drawImage(lvl2crabImage, viewport.offset[0] + lvl2Crab[i].position[0], viewport.offset[1] + lvl2Crab[i].position[1]);
	}
	for (i = 21; i < 31; i++) {
		ctx.drawImage(lvl3crabImage, viewport.offset[0] + lvl3Crab[i].position[0], viewport.offset[1] + lvl3Crab[i].position[1]);
	}
	var squidSprite = darkSquid.sprites[darkSquid.direction];
	ctx.drawImage(
		darkSquidImage,
		squidSprite[0].x,
		squidSprite[0].y,
		squidSprite[0].w,
		squidSprite[0].h,
		viewport.offset[0] + darkSquid.position[0],
		viewport.offset[1] + darkSquid.position[1],
		darkSquid.dimensions[0],
		darkSquid.dimensions[1]
	);
    
    ctx.textAlign = "right";
    
	//Draws Inventory
	for(var i = 0; i < player.inventory.spaces; i++)
	{
		ctx.fillStyle = "#ddccaa";
		ctx.fillRect(10 + (i * 50), 350,
			40, 40);
		
		if(typeof player.inventory.stacks[i]!='undefined')
		{
			var it = itemTypes[player.inventory.stacks[i].type];
			var sprite = it.sprite;
					
			ctx.drawImage(tileset,
				sprite[0].x, sprite[0].y,
				sprite[0].w, sprite[0].h,
				10 + (i * 50) + it.offset[0],
				350 + it.offset[1],
				sprite[0].w, sprite[0].h);
			
			if(player.inventory.stacks[i].qty>1)
			{
				ctx.fillStyle = "#000000";
				ctx.fillText("" + player.inventory.stacks[i].qty,
					10 + (i*50) + 38,
					350 + 38);
			}
		}
	}
	ctx.textAlign = "left";
	/*
ctx.drawImage(
	tileset,
	sprite[0].x,
	sprite[0].y,
	sprite[0].w,
	sprite[0].h,
	viewport.offset[0] + playx,
	viewport.offset[1] + playy,
	playx,
	playy
);*/
	console.log("x of char is: " + player.position[0] + ", y of char is: " + player.position[1]);

	//telling the browser to update the animation with this function before the next paint
	requestAnimationFrame(drawMap);
}
