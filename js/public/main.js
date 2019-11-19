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

//the variables associated with map and player sprites
var tileset = null,
	tilesetLoaded = false;

//This variable distinguishes different types of tile so that it can be used to make for a more dynamic map with obstacles
var floorTypes = {
	solid: 0,
	path: 1,
	water: 2,
	lava: 3
};

//the below variable stores all of the different types of tiles and assigns them a sprite from tileset.png
var tileTypes = {
	0: { colour: "#999999", floor: floorTypes.solid, sprite: [{ x: 200, y: 200, w: 40, h: 40 }] },
	1: { colour: "#eeeeee", floor: floorTypes.path, sprite: [{ x: 0, y: 0, w: 40, h: 40 }] },
	2: { colour: "#0B99F7", floor: floorTypes.path, sprite: [{ x: 40, y: 0, w: 40, h: 40 }] },
	3: { colour: "#0B99F7", floor: floorTypes.water, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },
	4: { colour: "#0B99F7", floor: floorTypes.path, sprite: [{ x: 120, y: 0, w: 40, h: 40 }] },
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

//drawing enemies onto screen
var crabReady = false;
var crabImage = new Image();
var lvl2crabReady = false;
var lvl2crabImage = new Image();

crabImage.onload = function() {
	crabReady = true;
};

lvl2crabImage.onload = function() {
	lvl2crabReady = true;
};

//Creates the crab object which will hold all of the sprite's information
function crabObject() {
	this.tileFrom = [17, 8];
	this.tileTo = [17, 8];
	this.thisMoved = 0;
	this.dimensions = [25, 25];
	this.position = [680, 320];
	this.delayMove = 250;
	this.hp = 40;
}

//creates instances of the crab object
var crab = new crabObject();
var crab1 = new crabObject();
var crab2 = new crabObject();
var crab3 = new crabObject();
var crab4 = new crabObject();
var crab5 = new crabObject();
var crab6 = new crabObject();

//Creates the higher level crab object
<<<<<<< HEAD
function lvl2crabObject()
{
    this.tileFrom   = [13,24];
    this.tileTo     = [13,24];
    this.thisMoved  = 0;
    this.dimensions = [35, 35];
    this.position   = [520, 960];
    this.delayMove  = 300;
    this.hp = 80;
=======
function lvl2crabObject() {
	this.tileFrom = [13, 24];
	this.tileTo = [13, 24];
	this.thisMoved = 0;
	this.dimensions = [30, 30];
	this.position = [520, 960];
	this.delayMove = 300;
	this.hp = 80;
>>>>>>> c3a846814cc3395f74d1bceda2da8b388a4a511a
}

//creates instances of the lvl2crab object
var crab7 = new lvl2crabObject();
var crab8 = new lvl2crabObject();
var crab9 = new lvl2crabObject();
var crab10 = new lvl2crabObject();
var crab11 = new lvl2crabObject();
var crab12 = new lvl2crabObject();
var crab13 = new lvl2crabObject();
var crab14 = new lvl2crabObject();
var crab15 = new lvl2crabObject();
var crab16 = new lvl2crabObject();
var crab17 = new lvl2crabObject();
var crab18 = new lvl2crabObject();
var crab19 = new lvl2crabObject();
var crab20 = new lvl2crabObject();

<<<<<<< HEAD

crab14.tileTo[22,37];
crab14.tileFrom[22,37];
crab14.position[880,1480];
crab15.tileTo[22,37];
crab15.tileTo[22,37];
crab15.position[880,1480];
crab16.tileTo[22,37];
crab16.tileTo[22,37];
crab16.position[880,1480];
crab17.tileTo[22,37];
crab17.tileTo[22,37];
crab17.position[880,1480];
crab18.tileTo[22,37];
crab18.tileTo[22,37];
crab18.position[880,1480];
crab19.tileTo[22,37];
crab19.tileTo[22,37];
crab19.position[880,1480];
crab20.tileTo[22,37];
crab20.tileTo[22,37];
crab20.position[880,1480];




=======
crab14.tileTo[(22, 37)];
crab14.tileTo[(22, 37)];
crab14.position[(880, 1480)];
crab15.tileTo[(22, 37)];
crab15.tileTo[(22, 37)];
crab15.position[(880, 1480)];
crab16.tileTo[(22, 37)];
crab16.tileTo[(22, 37)];
crab16.position[(880, 1480)];
crab17.tileTo[(22, 37)];
crab17.tileTo[(22, 37)];
crab17.position[(880, 1480)];
crab18.tileTo[(22, 37)];
crab18.tileTo[(22, 37)];
crab18.position[(880, 1480)];
crab19.tileTo[(22, 37)];
crab19.tileTo[(22, 37)];
crab19.position[(880, 1480)];
crab20.tileTo[(22, 37)];
crab20.tileTo[(22, 37)];
crab20.position[(880, 1480)];
>>>>>>> c3a846814cc3395f74d1bceda2da8b388a4a511a

//Creates the character object that will hold all of the player's information
function Character() {
	this.tileFrom = [1, 1];
	this.tileTo = [1, 1];
	this.thisMoved = 0;
	this.dimensions = [35, 35];
	this.position = [40, 40];
	this.hp = 100;

	this.delayMove = {};
	this.delayMove[floorTypes.path] = 120;
	this.delayMove[floorTypes.water] = 200;
	this.delayMove[floorTypes.lava] = 200;

	this.direction = directions.right;

	this.sprites = {};
	this.sprites[directions.right] = [{ x: 0, y: 205, w: 35, h: 35 }];
	this.sprites[directions.left] = [{ x: 35, y: 205, w: 35, h: 35 }];
	this.sprites[directions.up] = [{ x: 35, y: 170, w: 35, h: 35 }];
	this.sprites[directions.down] = [{ x: 0, y: 170, w: 35, h: 35 }];
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

//THE BELOW FUNCTIONS PLACE THE SPRITE AT THE DESIRED SPAWN POINT##############################################
//#############################################################################################################
Character.prototype.placeAt = function(x, y) {
	this.tileFrom = [x, y];
	this.tileTo = [x, y];
	this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
};

crabObject.prototype.placeAt = function(x, y) {
	this.tileFrom = [x, y];
	this.tileTo = [x, y];
	this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
};

lvl2crabObject.prototype.placeAt = function(x, y) {
	this.tileFrom = [x, y];
	this.tileTo = [x, y];
	this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
};

//THE BELOW FUNCTIONS MOVE THE SPRITE TO THE CORRECT TILE,#######################################################
// DETERMINES IT'S MOVEMENT SPEED AND PLACES IT IN THE MIDDLE OF THE TILE #######################################
Character.prototype.processMovement = function(t) {
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
};

crabObject.prototype.processMovement = function(t) {
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
};

lvl2crabObject.prototype.processMovement = function(t) {
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
};

//THE BELOW FUNCTIONS DETERMINE WHETHER OR NOT###############################################################
//THE SPRITES IN QUESTION ARE ABLE TO MOVE TO THE NEXT BLOCK OR NOT##########################################
Character.prototype.canMoveTo = function(x, y) {
	if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
		return false;
	}
	if (typeof this.delayMove[tileTypes[gameMap[toIndex(x, y)]].floor] == "undefined") {
		return false;
	}
	return true;
};

crabObject.prototype.canMoveTo = function(x, y) {
	if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
		return false;
	}
	if (
		(tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.sand && this.tileFrom[1] < 17) ||
		(tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.water && this.tileFrom[1] < 17)
	) {
		return true;
	} else if (
		tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.path ||
		tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.solid ||
		this.tileFrom[1] >= 17
	) {
		return false;
	}
};

lvl2crabObject.prototype.canMoveTo = function(x, y) {
	if (x < 0 || x >= mapW || y < 0 || y >= mapH) {
		return false;
	}
	if (tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.sand || tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.water) {
		return true;
	} else if (tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.path || tileTypes[gameMap[toIndex(x, y)]].floor == floorTypes.solid) {
		return false;
	}
};

//########################################SPRITE############################################################
//#######################################MOVEMENT###########################################################
//##########################################################################################################
Character.prototype.canMoveUp = function() {
	return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
};
Character.prototype.canMoveDown = function() {
	return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 2);
};
Character.prototype.canMoveLeft = function() {
	return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
};
Character.prototype.canMoveRight = function() {
	return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
};

Character.prototype.moveLeft = function(t) {
	this.tileTo[0] -= 1;
	this.timeMoved = t;
	this.direction = directions.left;
};
Character.prototype.moveRight = function(t) {
	this.tileTo[0] += 1;
	this.timeMoved = t;
	this.direction = directions.right;
};
Character.prototype.moveUp = function(t) {
	this.tileTo[1] -= 1;
	this.timeMoved = t;
	this.direction = directions.up;
};
Character.prototype.moveDown = function(t) {
	this.tileTo[1] += 1;
	this.timeMoved = t;
	this.direction = directions.down;
};

crabObject.prototype.canMoveUp = function() {
	return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
};
crabObject.prototype.canMoveDown = function() {
	return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
};
crabObject.prototype.canMoveLeft = function() {
	return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
};
crabObject.prototype.canMoveRight = function() {
	return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
};

crabObject.prototype.moveLeft = function(t) {
	this.tileTo[0] -= 1;
	this.timeMoved = t;
};
crabObject.prototype.moveRight = function(t) {
	this.tileTo[0] += 1;
	this.timeMoved = t;
};
crabObject.prototype.moveUp = function(t) {
	this.tileTo[1] -= 1;
	this.timeMoved = t;
};
crabObject.prototype.moveDown = function(t) {
	this.tileTo[1] += 1;
	this.timeMoved = t;
};

lvl2crabObject.prototype.canMoveUp = function() {
	return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
};
lvl2crabObject.prototype.canMoveDown = function() {
	return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
};
lvl2crabObject.prototype.canMoveLeft = function() {
	return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
};
lvl2crabObject.prototype.canMoveRight = function() {
	return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
};

lvl2crabObject.prototype.moveLeft = function(t) {
	this.tileTo[0] -= 1;
	this.timeMoved = t;
};
lvl2crabObject.prototype.moveRight = function(t) {
	this.tileTo[0] += 1;
	this.timeMoved = t;
};
lvl2crabObject.prototype.moveUp = function(t) {
	this.tileTo[1] -= 1;
	this.timeMoved = t;
};
lvl2crabObject.prototype.moveDown = function(t) {
	this.tileTo[1] += 1;
	this.timeMoved = t;
};

//when the browser is loaded, do this
window.onload = function() {
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

	tileset = new this.Image();

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

	//assigning sprites their images
	this.tileset.src = "tileset.png";
	this.crabImage.src = "enemyCrab.png";
	this.lvl2crabImage.src = "lvl2crab.png";
};

//creates the hp canvas and gives it the player's current hp
Character.prototype.gethp = function() {
	return this.hp;
};
Character.prototype.sethp = function(v) {
	this.hp = v;
	drawHp();
};
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
		player.sethp(player.gethp() - 1);
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

	/*######################MOVEMENT###############################
    #######################DIRECTION###############################
    #######################VARIABLES#############################*/
	var crabMovement = Math.floor(Math.random() * 4 + 1);
	var crab1Movement = Math.floor(Math.random() * 4 + 1);
	var crab2Movement = Math.floor(Math.random() * 4 + 1);
	var crab3Movement = Math.floor(Math.random() * 4 + 1);
	var crab4Movement = Math.floor(Math.random() * 4 + 1);
	var crab5Movement = Math.floor(Math.random() * 4 + 1);
	var crab6Movement = Math.floor(Math.random() * 4 + 1);
	var crab7Movement = Math.floor(Math.random() * 4 + 1);
	var crab8Movement = Math.floor(Math.random() * 4 + 1);
	var crab9Movement = Math.floor(Math.random() * 4 + 1);
	var crab10Movement = Math.floor(Math.random() * 4 + 1);
	var crab11Movement = Math.floor(Math.random() * 4 + 1);
	var crab12Movement = Math.floor(Math.random() * 4 + 1);
	var crab13Movement = Math.floor(Math.random() * 4 + 1);
	var crab14Movement = Math.floor(Math.random() * 4 + 1);
	var crab15Movement = Math.floor(Math.random() * 4 + 1);
	var crab16Movement = Math.floor(Math.random() * 4 + 1);
	var crab17Movement = Math.floor(Math.random() * 4 + 1);
	var crab18Movement = Math.floor(Math.random() * 4 + 1);
	var crab19Movement = Math.floor(Math.random() * 4 + 1);
	var crab20Movement = Math.floor(Math.random() * 4 + 1);

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

	if (!crab.processMovement(currentFrameTime)) {
		if (crabMovement == 1 && crab.canMoveUp()) {
			crab.moveUp(currentFrameTime);
		} else if (crabMovement == 2 && crab.canMoveDown()) {
			crab.moveDown(currentFrameTime);
		} else if (crabMovement == 3 && crab.canMoveLeft()) {
			crab.moveLeft(currentFrameTime);
		} else if (crabMovement == 4 && crab.canMoveRight()) {
			crab.moveRight(currentFrameTime);
		}
		if (crab.tileFrom[0] != crab.tileTo[0] || crab.tileFrom[1] != crab.tileTo[1]) {
			crab.timeMoved = currentFrameTime;
		}
	}

	if (!crab1.processMovement(currentFrameTime)) {
		if (crab1Movement == 1 && crab1.canMoveUp()) {
			crab1.moveUp(currentFrameTime);
		} else if (crab1Movement == 2 && crab1.canMoveDown()) {
			crab1.moveDown(currentFrameTime);
		} else if (crab1Movement == 3 && crab1.canMoveLeft()) {
			crab1.moveLeft(currentFrameTime);
		} else if (crab1Movement == 4 && crab1.canMoveRight()) {
			crab1.moveRight(currentFrameTime);
		}
		if (crab1.tileFrom[0] != crab1.tileTo[0] || crab1.tileFrom[1] != crab1.tileTo[1]) {
			crab1.timeMoved = currentFrameTime;
		}
	}

	if (!crab2.processMovement(currentFrameTime)) {
		if (crab2Movement == 1 && crab2.canMoveUp()) {
			crab2.moveUp(currentFrameTime);
		} else if (crab2Movement == 2 && crab2.canMoveDown()) {
			crab2.moveDown(currentFrameTime);
		} else if (crab2Movement == 3 && crab2.canMoveLeft()) {
			crab2.moveLeft(currentFrameTime);
		} else if (crab2Movement == 4 && crab2.canMoveRight()) {
			crab2.moveRight(currentFrameTime);
		}
		if (crab2.tileFrom[0] != crab2.tileTo[0] || crab2.tileFrom[1] != crab2.tileTo[1]) {
			crab2.timeMoved = currentFrameTime;
		}
	}

	if (!crab3.processMovement(currentFrameTime)) {
		if (crab3Movement == 1 && crab3.canMoveUp()) {
			crab3.moveUp(currentFrameTime);
		} else if (crab3Movement == 2 && crab3.canMoveDown()) {
			crab3.moveDown(currentFrameTime);
		} else if (crab3Movement == 3 && crab3.canMoveLeft()) {
			crab3.moveLeft(currentFrameTime);
		} else if (crab3Movement == 4 && crab3.canMoveRight()) {
			crab3.moveRight(currentFrameTime);
		}
		if (crab3.tileFrom[0] != crab3.tileTo[0] || crab3.tileFrom[1] != crab3.tileTo[1]) {
			crab3.timeMoved = currentFrameTime;
		}
	}

	if (!crab4.processMovement(currentFrameTime)) {
		if (crab4Movement == 1 && crab4.canMoveUp()) {
			crab4.moveUp(currentFrameTime);
		} else if (crab4Movement == 2 && crab4.canMoveDown()) {
			crab4.moveDown(currentFrameTime);
		} else if (crab4Movement == 3 && crab4.canMoveLeft()) {
			crab4.moveLeft(currentFrameTime);
		} else if (crab4Movement == 4 && crab4.canMoveRight()) {
			crab4.moveRight(currentFrameTime);
		}
		if (crab4.tileFrom[0] != crab4.tileTo[0] || crab4.tileFrom[1] != crab4.tileTo[1]) {
			crab4.timeMoved = currentFrameTime;
		}
	}

	if (!crab5.processMovement(currentFrameTime)) {
		if (crab5Movement == 1 && crab5.canMoveUp()) {
			crab5.moveUp(currentFrameTime);
		} else if (crab5Movement == 2 && crab5.canMoveDown()) {
			crab5.moveDown(currentFrameTime);
		} else if (crab5Movement == 3 && crab5.canMoveLeft()) {
			crab5.moveLeft(currentFrameTime);
		} else if (crab5Movement == 4 && crab5.canMoveRight()) {
			crab5.moveRight(currentFrameTime);
		}
		if (crab5.tileFrom[0] != crab5.tileTo[0] || crab5.tileFrom[1] != crab5.tileTo[1]) {
			crab5.timeMoved = currentFrameTime;
		}
	}

	if (!crab6.processMovement(currentFrameTime)) {
		if (crab6Movement == 1 && crab6.canMoveUp()) {
			crab6.moveUp(currentFrameTime);
		} else if (crab6Movement == 2 && crab6.canMoveDown()) {
			crab6.moveDown(currentFrameTime);
		} else if (crab6Movement == 3 && crab6.canMoveLeft()) {
			crab6.moveLeft(currentFrameTime);
		} else if (crab6Movement == 4 && crab6.canMoveRight()) {
			crab6.moveRight(currentFrameTime);
		}
		if (crab6.tileFrom[0] != crab6.tileTo[0] || crab6.tileFrom[1] != crab6.tileTo[1]) {
			crab6.timeMoved = currentFrameTime;
		}
	}
	if (!crab7.processMovement(currentFrameTime)) {
		if (crab7Movement == 1 && crab.canMoveUp()) {
			crab7.moveUp(currentFrameTime);
		} else if (crab7Movement == 2 && crab.canMoveDown()) {
			crab7.moveDown(currentFrameTime);
		} else if (crab7Movement == 3 && crab7.canMoveLeft()) {
			crab7.moveLeft(currentFrameTime);
		} else if (crab7Movement == 4 && crab7.canMoveRight()) {
			crab7.moveRight(currentFrameTime);
		}
		if (crab7.tileFrom[0] != crab7.tileTo[0] || crab7.tileFrom[1] != crab7.tileTo[1]) {
			crab7.timeMoved = currentFrameTime;
		}
	}

	if (!crab8.processMovement(currentFrameTime)) {
		if (crab8Movement == 1 && crab8.canMoveUp()) {
			crab8.moveUp(currentFrameTime);
		} else if (crab8Movement == 2 && crab8.canMoveDown()) {
			crab8.moveDown(currentFrameTime);
		} else if (crab8Movement == 3 && crab8.canMoveLeft()) {
			crab8.moveLeft(currentFrameTime);
		} else if (crab8Movement == 4 && crab8.canMoveRight()) {
			crab8.moveRight(currentFrameTime);
		}
		if (crab8.tileFrom[0] != crab8.tileTo[0] || crab8.tileFrom[1] != crab8.tileTo[1]) {
			crab8.timeMoved = currentFrameTime;
		}
	}

	if (!crab9.processMovement(currentFrameTime)) {
		if (crab9Movement == 1 && crab9.canMoveUp()) {
			crab9.moveUp(currentFrameTime);
		} else if (crab9Movement == 2 && crab9.canMoveDown()) {
			crab9.moveDown(currentFrameTime);
		} else if (crab9Movement == 3 && crab9.canMoveLeft()) {
			crab9.moveLeft(currentFrameTime);
		} else if (crab9Movement == 4 && crab9.canMoveRight()) {
			crab9.moveRight(currentFrameTime);
		}
		if (crab9.tileFrom[0] != crab9.tileTo[0] || crab9.tileFrom[1] != crab9.tileTo[1]) {
			crab9.timeMoved = currentFrameTime;
		}
	}

	if (!crab10.processMovement(currentFrameTime)) {
		if (crab10Movement == 1 && crab10.canMoveUp()) {
			crab10.moveUp(currentFrameTime);
		} else if (crab10Movement == 2 && crab10.canMoveDown()) {
			crab10.moveDown(currentFrameTime);
		} else if (crab10Movement == 3 && crab10.canMoveLeft()) {
			crab10.moveLeft(currentFrameTime);
		} else if (crab10Movement == 4 && crab10.canMoveRight()) {
			crab10.moveRight(currentFrameTime);
		}
		if (crab10.tileFrom[0] != crab10.tileTo[0] || crab10.tileFrom[1] != crab10.tileTo[1]) {
			crab10.timeMoved = currentFrameTime;
		}
	}

	if (!crab11.processMovement(currentFrameTime)) {
		if (crab11Movement == 1 && crab11.canMoveUp()) {
			crab11.moveUp(currentFrameTime);
		} else if (crab11Movement == 2 && crab11.canMoveDown()) {
			crab11.moveDown(currentFrameTime);
		} else if (crab11Movement == 3 && crab11.canMoveLeft()) {
			crab11.moveLeft(currentFrameTime);
		} else if (crab11Movement == 4 && crab11.canMoveRight()) {
			crab11.moveRight(currentFrameTime);
		}
		if (crab11.tileFrom[0] != crab11.tileTo[0] || crab11.tileFrom[1] != crab11.tileTo[1]) {
			crab11.timeMoved = currentFrameTime;
		}
	}

	if (!crab12.processMovement(currentFrameTime)) {
		if (crab12Movement == 1 && crab12.canMoveUp()) {
			crab12.moveUp(currentFrameTime);
		} else if (crab5Movement == 2 && crab12.canMoveDown()) {
			crab12.moveDown(currentFrameTime);
		} else if (crab12Movement == 3 && crab12.canMoveLeft()) {
			crab12.moveLeft(currentFrameTime);
		} else if (crab12Movement == 4 && crab12.canMoveRight()) {
			crab12.moveRight(currentFrameTime);
		}
		if (crab12.tileFrom[0] != crab12.tileTo[0] || crab12.tileFrom[1] != crab12.tileTo[1]) {
			crab12.timeMoved = currentFrameTime;
		}
	}

	if (!crab13.processMovement(currentFrameTime)) {
		if (crab13Movement == 1 && crab13.canMoveUp()) {
			crab13.moveUp(currentFrameTime);
		} else if (crab13Movement == 2 && crab13.canMoveDown()) {
			crab13.moveDown(currentFrameTime);
		} else if (crab13Movement == 3 && crab13.canMoveLeft()) {
			crab13.moveLeft(currentFrameTime);
		} else if (crab13Movement == 4 && crab13.canMoveRight()) {
			crab13.moveRight(currentFrameTime);
		}
		if (crab13.tileFrom[0] != crab13.tileTo[0] || crab13.tileFrom[1] != crab13.tileTo[1]) {
			crab13.timeMoved = currentFrameTime;
		}
	}

	if (!crab14.processMovement(currentFrameTime)) {
		if (crab14Movement == 1 && crab14.canMoveUp()) {
			crab14.moveUp(currentFrameTime);
		} else if (crab14Movement == 2 && crab14.canMoveDown()) {
			crab14.moveDown(currentFrameTime);
		} else if (crab14Movement == 3 && crab14.canMoveLeft()) {
			crab14.moveLeft(currentFrameTime);
		} else if (crab14Movement == 4 && crab14.canMoveRight()) {
			crab14.moveRight(currentFrameTime);
		}
		if (crab14.tileFrom[0] != crab14.tileTo[0] || crab14.tileFrom[1] != crab14.tileTo[1]) {
			crab14.timeMoved = currentFrameTime;
		}
	}

	if (!crab15.processMovement(currentFrameTime)) {
		if (crab15Movement == 1 && crab15.canMoveUp()) {
			crab15.moveUp(currentFrameTime);
		} else if (crab15Movement == 2 && crab15.canMoveDown()) {
			crab15.moveDown(currentFrameTime);
		} else if (crab15Movement == 3 && crab15.canMoveLeft()) {
			crab15.moveLeft(currentFrameTime);
		} else if (crab15Movement == 4 && crab15.canMoveRight()) {
			crab15.moveRight(currentFrameTime);
		}
		if (crab15.tileFrom[0] != crab15.tileTo[0] || crab15.tileFrom[1] != crab15.tileTo[1]) {
			crab15.timeMoved = currentFrameTime;
		}
	}

	if (!crab16.processMovement(currentFrameTime)) {
		if (crab16Movement == 1 && crab16.canMoveUp()) {
			crab16.moveUp(currentFrameTime);
		} else if (crab16Movement == 2 && crab16.canMoveDown()) {
			crab16.moveDown(currentFrameTime);
		} else if (crab16Movement == 3 && crab16.canMoveLeft()) {
			crab16.moveLeft(currentFrameTime);
		} else if (crab16Movement == 4 && crab16.canMoveRight()) {
			crab16.moveRight(currentFrameTime);
		}
		if (crab16.tileFrom[0] != crab16.tileTo[0] || crab16.tileFrom[1] != crab16.tileTo[1]) {
			crab16.timeMoved = currentFrameTime;
		}
	}

	if (!crab17.processMovement(currentFrameTime)) {
		if (crab17Movement == 1 && crab17.canMoveUp()) {
			crab17.moveUp(currentFrameTime);
		} else if (crab17Movement == 2 && crab17.canMoveDown()) {
			crab17.moveDown(currentFrameTime);
		} else if (crab17Movement == 3 && crab17.canMoveLeft()) {
			crab17.moveLeft(currentFrameTime);
		} else if (crab17Movement == 4 && crab17.canMoveRight()) {
			crab17.moveRight(currentFrameTime);
		}
		if (crab17.tileFrom[0] != crab17.tileTo[0] || crab17.tileFrom[1] != crab17.tileTo[1]) {
			crab17.timeMoved = currentFrameTime;
		}
	}

	if (!crab18.processMovement(currentFrameTime)) {
		if (crab18Movement == 1 && crab18.canMoveUp()) {
			crab18.moveUp(currentFrameTime);
		} else if (crab18Movement == 2 && crab18.canMoveDown()) {
			crab18.moveDown(currentFrameTime);
		} else if (crab18Movement == 3 && crab18.canMoveLeft()) {
			crab18.moveLeft(currentFrameTime);
		} else if (crab18Movement == 4 && crab18.canMoveRight()) {
			crab18.moveRight(currentFrameTime);
		}
		if (crab18.tileFrom[0] != crab18.tileTo[0] || crab18.tileFrom[1] != crab18.tileTo[1]) {
			crab18.timeMoved = currentFrameTime;
		}
	}

	if (!crab19.processMovement(currentFrameTime)) {
		if (crab19Movement == 1 && crab19.canMoveUp()) {
			crab19.moveUp(currentFrameTime);
		} else if (crab19Movement == 2 && crab19.canMoveDown()) {
			crab19.moveDown(currentFrameTime);
		} else if (crab19Movement == 3 && crab19.canMoveLeft()) {
			crab19.moveLeft(currentFrameTime);
		} else if (crab19Movement == 4 && crab19.canMoveRight()) {
			crab19.moveRight(currentFrameTime);
		}
		if (crab19.tileFrom[0] != crab19.tileTo[0] || crab19.tileFrom[1] != crab19.tileTo[1]) {
			crab19.timeMoved = currentFrameTime;
		}
	}

	if (!crab20.processMovement(currentFrameTime)) {
		if (crab20Movement == 1 && crab20.canMoveUp()) {
			crab20.moveUp(currentFrameTime);
		} else if (crab20Movement == 2 && crab20.canMoveDown()) {
			crab20.moveDown(currentFrameTime);
		} else if (crab20Movement == 3 && crab20.canMoveLeft()) {
			crab20.moveLeft(currentFrameTime);
		} else if (crab20Movement == 4 && crab20.canMoveRight()) {
			crab20.moveRight(currentFrameTime);
		}
		if (crab20.tileFrom[0] != crab20.tileTo[0] || crab20.tileFrom[1] != crab20.tileTo[1]) {
			crab20.timeMoved = currentFrameTime;
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

	/*###################################SPRITE##########################################
    ######################################DRAW###########################################
    ####################################FUNCTIONS########################################
    */
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

	ctx.drawImage(crabImage, viewport.offset[0] + crab.position[0], viewport.offset[1] + crab.position[1]);
	ctx.drawImage(crabImage, viewport.offset[0] + crab1.position[0], viewport.offset[1] + crab1.position[1]);
	ctx.drawImage(crabImage, viewport.offset[0] + crab2.position[0], viewport.offset[1] + crab2.position[1]);
	ctx.drawImage(crabImage, viewport.offset[0] + crab3.position[0], viewport.offset[1] + crab3.position[1]);
	ctx.drawImage(crabImage, viewport.offset[0] + crab4.position[0], viewport.offset[1] + crab4.position[1]);
	ctx.drawImage(crabImage, viewport.offset[0] + crab5.position[0], viewport.offset[1] + crab5.position[1]);
	ctx.drawImage(crabImage, viewport.offset[0] + crab6.position[0], viewport.offset[1] + crab6.position[1]);

	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab7.position[0], viewport.offset[1] + crab7.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab8.position[0], viewport.offset[1] + crab8.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab9.position[0], viewport.offset[1] + crab9.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab10.position[0], viewport.offset[1] + crab10.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab11.position[0], viewport.offset[1] + crab11.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab12.position[0], viewport.offset[1] + crab12.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab13.position[0], viewport.offset[1] + crab13.position[1]);

	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab14.position[0], viewport.offset[1] + crab14.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab15.position[0], viewport.offset[1] + crab15.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab16.position[0], viewport.offset[1] + crab16.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab17.position[0], viewport.offset[1] + crab17.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab18.position[0], viewport.offset[1] + crab18.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab19.position[0], viewport.offset[1] + crab19.position[1]);
	ctx.drawImage(lvl2crabImage, viewport.offset[0] + crab20.position[0], viewport.offset[1] + crab20.position[1]);

	console.log("x of char is: " + player.position[0] + ", y of char is: " + player.position[1]);

	//telling the browser to update the animation with this function before the next paint
	requestAnimationFrame(drawMap);
}
