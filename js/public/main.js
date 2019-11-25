//the canvas variables
var ctx = null;
var ctx_hp = null;
var ctx_inventory = null;
var audio = null;
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
var arrowList = [];
//This variable distinguishes different types of tile so that it can be used to make for a more dynamic map with obstacles
var floorTypes = {
	solid: 0,
	path: 1,
	water: 2,
	lava: 3,
	sand: 4,
	darkPath: 5,
	borderPath: 6,
	borderWater: 7,
	borderLava: 8,
	borderSand: 9,
	borderDarkPath: 10
};

//the below variable stores all of the different types of tiles and assigns them a sprite from tileset.png
var tileTypes = {
	0: { floor: floorTypes.solid, sprite: [{ x: 200, y: 200, w: 40, h: 40 }] },
	1: { floor: floorTypes.path, sprite: [{ x: 0, y: 0, w: 40, h: 40 }] },
	2: { floor: floorTypes.sand, sprite: [{ x: 40, y: 0, w: 40, h: 40 }] },
	3: { floor: floorTypes.water, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },
	4: { floor: floorTypes.darkPath, sprite: [{ x: 120, y: 0, w: 40, h: 40 }] },
	5: { floor: floorTypes.lava, sprite: [{ x: 160, y: 0, w: 40, h: 40 }] },
	6: { floor: floorTypes.borderPath, sprite: [{ x: 0, y: 0, w: 40, h: 40 }] },
	7: { floor: floorTypes.borderSand, sprite: [{ x: 40, y: 0, w: 40, h: 40 }] },
	8: { floor: floorTypes.borderWater, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },
	9: { floor: floorTypes.borderDarkPath, sprite: [{ x: 120, y: 0, w: 40, h: 40 }] },
	10: { floor: floorTypes.borderLava, sprite: [{ x: 160, y: 0, w: 40, h: 40 }] }
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
	68: false,
    38: false
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
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 7, 7, 8, 8, 8, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 7, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 7, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 8, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 4, 4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 1, 0,
	0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 8, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 7, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 7, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 5, 5, 5, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 7, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 5, 5, 5, 0,
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
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 9, 9, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 10, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
	0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 4, 4, 4, 4, 4, 5, 5, 5, 5, 0,
   	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

var occupiedGrid = [];

for (i = 0; i < gameMap.length; i++) {
	occupiedGrid.push(false);
}

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

//the variables associated with loading the sound button
var soundImageReady = false;
var soundImage = new Image();

//creating the variables necessary to load the sprites onto the enemies
var crabReady = false;
var crabImage = new Image();
var lvl2crabReady = false;
var lvl2crabImage = new Image();
var lvl3crabReady = false;
var lvl3crabImage = new Image();

var darkSquidReady = false;
var darkSquidImage = new Image();

var arrowReady = false;
var arrowImage = new Image()
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
        if(this.hp > 0){
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
	}
	respawn() {
		this.placeAt(17,8);
		this.hp = 40;
	}
	damage(x) {
		this.hp -= x;
		if (this.hp < 0) {
			this.respawn();
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

//Creates the dark squid object
class darkSquidObject {
	constructor() {
		this.tileFrom = [57, 57];
		this.tileTo = [57, 57];
		this.thisMoved = 0;
		this.dimensions = [66, 80];
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

//creates instances of the dark squid object
darkSquid = new darkSquidObject();

class SoundButton {
	constructor() {
		this.dimensions = [30, 30];
		this.position = [0, 570];
		this.on = true;
		this.sprites = [{ x: 33, y: 0, w: 300, h: 300 }];
	}
	placeAt(x, y) {
		this.position = [tileW * x + (tileW - this.dimensions[0]) / 2, tileH * y + (tileH - this.dimensions[1]) / 2];
	}
}

//creates instance of sound button
soundButton = new SoundButton();

class Arrow {
	constructor(shooterObj, dir) {
		this.position = shooterObj.position;
		this.tileFrom = shooterObj.tileFrom;
		this.direction = dir;
		this.dimensions = [40, 40];
		if (dir == 0) {
			this.tileTo = [shooterObj.tileFrom[0]+1,shooterObj.tileFrom[1]];
		}
	}
	moveRight(t) {
		this.timeMoved = t;
		this.direction = directions.right;
		this.tileTo[0] +=1;
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
		var moveSpeed = 0.04;
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
}
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
		this.delayMove[floorTypes.borderPath] = 120;
		this.delayMove[floorTypes.borderSand] = 120;
		this.delayMove[floorTypes.borderWater] = 200;
		this.delayMove[floorTypes.borderLava] = 200;
		this.delayMove[floorTypes.borderDarkPath] = 120;
		this.direction = directions.right;
		this.sprites = {};
		this.sprites[directions.right] = [{ x: 0, y: 205, w: 35, h: 35 }];
		this.sprites[directions.left] = [{ x: 35, y: 205, w: 35, h: 35 }];
		this.sprites[directions.up] = [{ x: 35, y: 170, w: 35, h: 35 }];
		this.sprites[directions.down] = [{ x: 0, y: 170, w: 35, h: 35 }];
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
	attack(dir) {
		var a = new Arrow(this,0)
		arrowList.push(a)
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

	//###################################################INVENTORY#######################################################
	//###################################################VARIABLES#######################################################
	//###################################################################################################################
	
	var healthpotImage = new Image();
	this.healthpotImage.src = "assets/images/items/healthpot.png";

	var archerbow1Image = new Image();
	this.archerbow1Image.src = "assets/images/items/archerbow1.png";
	var archerbow2Image = new Image();
	this.archerbow2Image.src = "assets/images/items/archerbow2.png";
	var archerbow3Image = new Image();
	this.archerbow3Image.src = "assets/images/items/archerbow3.png";
	var archerbow4Image = new Image();
	this.archerbow4Image.src = "assets/images/items/archerbow4.png";

	var knightsword1Image = new Image();
	this.knightsword1Image.src = "assets/images/items/knightsword1.png";
	var knightsword2Image = new Image();
	this.knightsword2Image.src = "assets/images/items/knightsword2.png";
	var knightsword3Image = new Image();
	this.knightsword3Image.src = "assets/images/items/knightsword3.png";
	var knightsword4Image = new Image();
	this.knightsword4Image.src = "assets/images/items/knightsword4.png";

	var magestaff1Image = new Image();
	this.magestaff1Image.src = "assets/images/items/magestaff1.png";
	var magestaff2Image = new Image();
	this.magestaff2Image.src = "assets/images/items/magestaff2.png";
	var magestaff3Image = new Image();
	this.magestaff3Image.src = "assets/images/items/magestaff3.png";
	var magestaff4Image = new Image();
	this.magestaff4Image.src = "assets/images/items/magestaff4.png";

	var items = [];


	items = [healthpotImage,archerbow1Image,archerbow4Image, archerbow4Image, archerbow4Image]

//when the browser is loaded, do this
window.onload = function() {
	//sends position of player to the server every 100 milliseconds
	window.setInterval(function() {
		getPosition();
	}, 100);
	//assigning the ctx variables to their respective canvases
	ctx = document.getElementById("map").getContext("2d");
	ctx_hp = document.getElementById("playerhp").getContext("2d");
	ctx_inventory = document.getElementById("playerinventory").getContext("2d");
	//assigning the audio variable to the correct file
	audio = new this.Audio("assets/Fighting-Dragons-on-The-Moon.mp3")
	audio.volume = 0.02;
	

	//tells the browser that upon loading, it must call this function to update the animation before the next repaint
	requestAnimationFrame(drawMap);

	//tells the browser that if any of the WASD keys are pressed, assign keysDown variable to true
	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68 || e.keycode == 38) {
			keysDown[e.keyCode] = true;
			if(soundButton.on == true){
				audio.play();
			}
		}
	});
	//tells the browser that if any of the WASD keys are pressed, assign keysDown variable to true
	window.addEventListener("keyup", function(e) {
		if (e.keyCode == 87 || e.keyCode == 65 || e.keyCode == 83 || e.keyCode == 68 || e.keyCode == 38) {
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
		crabReady = true;
	};

	this.lvl2crabImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.lvl2crabImage.onload = function() {
		lvl2crabReady = true;
	};
	this.arrowImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites")
	}
	this.arrowImage.onlead = function() {
		arrowReady = true;
	}
	this.lvl3crabImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.lvl3crabImage.onload = function() {
		lvl3crabReady = true;
	};

	this.darkSquidImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.darkSquidImage.onload = function() {
		darkSquidReady = true;
	};

	this.soundImage.onerror = function() {
		ctx = null;
		alert("Failed to load sprites");
	};
	this.soundImage.onload = function() {
		soundImageReady = true;
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
	this.soundImage.src = "assets/images/volumeenable.png";  
	this.arrowImage.src = "assets/images/arrow.png";
};

/*#################################DRAW#########################################
#################################FUNCTIONS######################################
################################################################################
*/

//creates the hp canvas and gives it the player's current hp
function drawHp() {
	if (ctx_hp == null) {
		return;
	}
	ctx_hp.clearRect(0, 0, 6000, 200);
	ctx_hp.fillStyle = "#ff0000";
	ctx_hp.fillRect(0, 0, player.gethp() * 6, 10);
}

//creates the inventory canvas and draws the items onto it
function drawInventory() {
	if (ctx_inventory == null) {
		alert("inventory not loaded");
	}
	ctx_inventory.fillStyle = "#ddccaa";
	ctx_inventory.fillRect(0, 0, 210, 350);
	for(i=0; i <items.length; i++){
		if(i>4 && i<8){
			ctx_inventory.drawImage(items[i], (10 * ((i + 1)-4))  + (i * 40), 60);
		}
		else{ctx_inventory.drawImage(items[i], (10 * (i + 1))  + (i * 40), 10);}
	}

}

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
	drawInventory();

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
	for (i=0; i<arrowList.length;i++) {
		if (!arrowList[i].processMovement(currentFrameTime)) {
			if (arrowList[i].direction == 0) {
				arrowList[i].moveRight(currentFrameTime)
			}
		}
		if (arrowList[i].tileFrom[0] != arrowList[i].tileTo[0] || arrowList[i].tileFrom[1] != arrowList[i].tileTo[1]) {
			arrowList[i].timeMoved = currentFrameTime;
		}  
	}
	if (!player.processMovement(currentFrameTime)) {
		if (keysDown[87] && player.canMoveUp()) {
			player.moveUp(currentFrameTime);
            player.attackUp();
		} else if (keysDown[83] && player.canMoveDown()) {
			player.moveDown(currentFrameTime);
            player.attackDown();
		} else if (keysDown[65] && player.canMoveLeft()) {
			player.moveLeft(currentFrameTime);
            player.attackLeft();
		} else if (keysDown[68] && player.canMoveRight()) {
			player.moveRight(currentFrameTime);
            player.attack(player,0);
		} else if(keysDown[38]){
            window.alert("if call");
            player.attack();
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
	ctx.fillStyle = "black";
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
	for (i=0; i < arrowList.length;i++) {
		ctx.drawImage(arrowImage, viewport.offset[0] + arrowList[i].position[0], viewport.offset[1] + arrowList[i].position[1])
	}
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
	


    var canvas = document.getElementById('map');
	
	//draws the sound button and makes it toggle on and off
	var soundButtonHitbox = {
		x:0,
		y:570,
		width:30,
		height:30
	}
	if(soundButton.on != null){
		var sprite = soundButton.sprites;
		ctx.drawImage(soundImage, 0, 570, 30, 30)
		canvas.addEventListener('click', function(evt) {
			var mousePos = getMousePos(canvas, evt);
		
			if (isInside(mousePos,soundButtonHitbox)) {
				if(soundButton.on == true)
				{
					audio.pause();
					soundButton.on = false;

				}
				else
				{
					audio.play();
					soundButton.on = true;
				}
			}
		}, false);
		
	}

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
	//console.log("x of char is: " + player.position[0] + ", y of char is: " + player.position[1]);

	//telling the browser to update the animation with this function before the next paint
	requestAnimationFrame(drawMap);
}
