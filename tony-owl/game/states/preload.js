
'use strict';



function Preload() {
  this.asset = null;
  this.ready = false;
}



Preload.prototype = {
  preload: function() {
	  
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);
    
    this.load.image('logo', 'assets/images/logo.png');
    
    this.load.image('background', 'assets/images/city.png');
    this.load.image('sky', 'assets/images/sky.png');
    this.load.image('ground', 'assets/images/platform.png');
    this.load.image('title', 'assets/images/title.png');
    this.load.image('startButton', 'assets/images/start_button.png');
    this.load.spritesheet('muteButton', 'assets/images/mute_button.png', 125, 125, 2);
    this.load.image('guitar', 'assets/images/guitar.png');
    this.load.spritesheet('ampli', 'assets/images/ampli-sheet.png', 37, 66, 12);
    
    
    // characters
    this.load.spritesheet('owl', 'assets/images/tony-owl-sheet.png', 78, 76, -1);
    this.load.spritesheet('negaowl', 'assets/images/negaowl-sheet.png', 379, 500, -1);
    
    // maps
    this.load.tilemap('level1', 'assets/tilemaps/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/tilemaps/tiles/tiles32.png');
    
    // Audio
    this.load.audio('menu', 'assets/audio/music/menu.ogg');
    this.load.audio('entering', 'assets/audio/music/entering.ogg');
    this.load.audio('die', 'assets/audio/music/die.ogg');
    this.load.audio('hurt', 'assets/audio/music/hurt.ogg');
    this.load.audio('win', 'assets/audio/music/win.ogg');
    this.load.audio('play', 'assets/audio/music/play.ogg');
    

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
