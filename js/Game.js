
var TopDownGame = TopDownGame;
//title screen
TopDownGame.Game = function(){};

TopDownGame.Game.prototype = {
  create: function() {
    //Using placeholder levels before chunks can be used
    this.map = this.game.add.tilemap('level1');

    //adds tile sets
    this.map.addTilesetImage('tiles', 'gameTiles');

    //Creates 2 layers
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');

    //Adds collisions to all blocks between 1 and 2000 on the layer blockedLayer
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();


    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
    //Gets player sprite with 0 x and y offset
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
    //enables default arcade physics for player
    this.game.physics.arcade.enable(this.player);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },

  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);

    //player movement
    //Sets player default speed to 0
    this.player.body.velocity.x = 0;

    //if the user presses down on arrow keys it sets speed to -50
    if(this.cursors.up.isDown) {
      if(this.player.body.velocity.y == 0)
      this.player.body.velocity.y -= 50;
    }
    else if(this.cursors.down.isDown) {
      if(this.player.body.velocity.y == 0)
      this.player.body.velocity.y += 50;
    }
    //stops player when user lets go of key
    else {
      this.player.body.velocity.y = 0;
    }
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= 50;
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += 50;
    }
  },
};