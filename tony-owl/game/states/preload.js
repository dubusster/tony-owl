
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
    
    this.load.image('logo', 'assets/logo5_small.png');
    
    this.load.image('sky', 'assets/sky.png');
    this.load.image('background', 'assets/city.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('title', 'assets/title.png');
    this.load.image('startButton', 'assets/start-button.png');
    
    this.load.spritesheet('owl', 'assets/owl.png', 32, 48, 9);

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
