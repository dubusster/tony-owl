
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
    
    this.load.image('logo', 'assets/images/logo5_small.png');
    
    this.load.image('background', 'assets/images/city.png');
    this.load.image('sky', 'assets/images/sky.png');
    this.load.image('ground', 'assets/images/platform.png');
    this.load.image('title', 'assets/images/title.png');
    this.load.image('startButton', 'assets/images/start_button.png');
    this.load.image('guitar', 'assets/images/guitar.png');
    this.load.image('ampli', 'assets/images/ampli.png');
    
    // characters
    this.load.spritesheet('owl', 'assets/images/tony-owl-sheet.png', 64, 76, 5);
//    this.load.image('negaowl', 'assets/images/negaowl.png');
    this.load.spritesheet('negaowl', 'assets/images/tony-owl-sheet.png', 64, 76, 5);
    
    
    // Audio
    this.load.audio('menu', 'assets/audio/music/menu.ogg');
    this.load.audio('gameover', 'assets/audio/music/gameover.ogg');
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
